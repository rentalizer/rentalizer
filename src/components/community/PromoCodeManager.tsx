import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiService, PromoCodeEntry } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import {
  Copy,
  Loader2,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

const DEFAULT_PAGE_LIMIT = 25;

export const PromoCodeManager: React.FC = () => {
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState<PromoCodeEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [statusMutationCode, setStatusMutationCode] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPromoCodes = useCallback(
    async ({ silent = false, suppressToast = false }: { silent?: boolean; suppressToast?: boolean } = {}) => {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
        setIsRefreshing(false);
      }

      setErrorMessage(null);

      try {
        const response = await apiService.getPromoCodes({
          page: 1,
          limit: DEFAULT_PAGE_LIMIT
        });
        setPromoCodes(response.promoCodes);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load promo codes';
        setErrorMessage(message);
        if (!suppressToast) {
          toast({
            variant: 'destructive',
            title: 'Unable to load promo codes',
            description: message
          });
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadPromoCodes();
  }, [loadPromoCodes]);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const response = await apiService.createPromoCode({
        description: description.trim() || undefined,
        singleUse: true
      });
      setPromoCodes((prev) => [response.promoCode, ...prev]);
      setDescription('');
      toast({
        variant: 'success',
        title: 'Promo code generated',
        description: `Code ${response.promoCode.code} is ready to share.`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate promo code';
      toast({
        variant: 'destructive',
        title: 'Generation failed',
        description: message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleStatus = async (code: string, isActive: boolean) => {
    setStatusMutationCode(code);
    try {
      const response = await apiService.updatePromoCodeStatus(code, !isActive);
      setPromoCodes((prev) =>
        prev.map((promo) =>
          promo.code === response.promoCode.code ? response.promoCode : promo
        )
      );

      toast({
        variant: 'success',
        title: response.promoCode.isActive ? 'Promo code activated' : 'Promo code deactivated',
        description: `Code ${response.promoCode.code} is now ${response.promoCode.isActive ? 'active' : 'inactive'}.`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update promo code';
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: message
      });
    } finally {
      setStatusMutationCode(null);
    }
  };

  const handleRefresh = async () => {
    await loadPromoCodes({ silent: true });
  };

  const handleCopyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: 'Promo code copied',
        description: `${code} copied to clipboard`
      });
      setTimeout(() => setCopiedCode((current) => (current === code ? null : current)), 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Unable to copy promo code. Please copy it manually.'
      });
    }
  };

  const stats = useMemo(() => {
    const total = promoCodes.length;
    const active = promoCodes.filter((code) => code.isActive).length;
    const singleUse = promoCodes.filter((code) => code.singleUse).length;
    const used = promoCodes.filter((code) => code.usageCount > 0).length;

    return { total, active, singleUse, used };
  }, [promoCodes]);

  const renderUsage = (promo: PromoCodeEntry) => {
    if (typeof promo.maxUsage === 'number') {
      return `${promo.usageCount}/${promo.maxUsage}`;
    }
    return `${promo.usageCount} / ∞`;
  };

  const renderUsageBadge = (promo: PromoCodeEntry) => {
    const remaining =
      typeof promo.maxUsage === 'number'
        ? Math.max(promo.maxUsage - promo.usageCount, 0)
        : null;

    if (promo.singleUse || promo.maxUsage === 1) {
      return (
        <Badge variant={remaining === 0 ? 'destructive' : 'outline'}>
          {remaining === 0 ? 'Used' : 'Single Use'}
        </Badge>
      );
    }

    if (remaining === 0) {
      return <Badge variant="destructive">Exhausted</Badge>;
    }

    return <Badge variant="outline">Reusable</Badge>;
  };

  const renderLastUsed = (promo: PromoCodeEntry) => {
    if (!promo.lastUsedAt) {
      return '—';
    }

    try {
      return formatDistanceToNow(new Date(promo.lastUsedAt), { addSuffix: true });
    } catch (error) {
      return new Date(promo.lastUsedAt).toLocaleString();
    }
  };

  const renderCreatedAt = (promo: PromoCodeEntry) => {
    try {
      return formatDistanceToNow(new Date(promo.createdAt), { addSuffix: true });
    } catch (error) {
      return new Date(promo.createdAt).toLocaleString();
    }
  };

  return (
    <Card className="bg-slate-800/60 border border-cyan-500/20">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-cyan-200">
          Promo Code Manager
        </CardTitle>
        <p className="text-sm text-gray-300">
          Generate single-use invitation codes and monitor their usage. Codes created here
          automatically deactivate after their first successful registration.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-cyan-500/20 bg-slate-900/50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Total Codes</p>
            <p className="mt-1 text-2xl font-semibold text-white">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-slate-900/50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Active</p>
            <p className="mt-1 text-2xl font-semibold text-green-300">{stats.active}</p>
          </div>
          <div className="rounded-lg border border-purple-500/20 bg-slate-900/50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Single Use</p>
            <p className="mt-1 text-2xl font-semibold text-purple-300">{stats.singleUse}</p>
          </div>
          <div className="rounded-lg border border-blue-500/20 bg-slate-900/50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">Used Codes</p>
            <p className="mt-1 text-2xl font-semibold text-blue-300">{stats.used}</p>
          </div>
        </div>

        <div className="rounded-lg border border-cyan-500/20 bg-slate-900/50 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            {/* Left: label + input (row 1) */}
            <div>
              <Label htmlFor="promo-description" className="text-sm text-gray-200">
                Description (optional)
              </Label>
              <Input
                id="promo-description"
                placeholder="Campaign, event, or cohort details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 bg-slate-800/70 text-white border-cyan-500/20 focus:border-cyan-400"
                maxLength={200}
                disabled={isGenerating}
              />
            </div>

            {/* Right: buttons (row 1) */}
            <div className="flex gap-2 self-end md:place-self-end">
              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating}
                className="bg-cyan-600 hover:bg-cyan-500 text-white whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Single-Use Code'
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                className="whitespace-nowrap border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>

            {/* Helper text (row 2 spans both columns) */}
            <p className="text-xs text-gray-400 md:col-span-2">
              Descriptions are only visible to admins and help track where codes are used.
            </p>
          </div>
        </div>


        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : promoCodes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-cyan-500/20 bg-slate-900/40 p-8 text-center text-gray-300">
            No promo codes have been generated yet. Use the button above to create the first code.
          </div>
        ) : (
          <div className="rounded-lg border border-cyan-500/20 bg-slate-900/40">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800/60">
                  <TableHead className="text-gray-200">Code</TableHead>
                  <TableHead className="text-gray-200">Usage</TableHead>
                  <TableHead className="text-gray-200">Type</TableHead>
                  <TableHead className="text-gray-200">Status</TableHead>
                  <TableHead className="text-gray-200">Description</TableHead>
                  <TableHead className="text-gray-200">Last Used</TableHead>
                  <TableHead className="text-gray-200">Created</TableHead>
                  <TableHead className="text-gray-200 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoCodes.map((promo) => (
                  <TableRow key={promo._id}>
                    <TableCell className="font-mono text-sm text-white">
                      {promo.code}
                    </TableCell>
                    <TableCell className="text-gray-200">{renderUsage(promo)}</TableCell>
                    <TableCell>{renderUsageBadge(promo)}</TableCell>
                    <TableCell>
                      <Badge variant={promo.isActive ? 'default' : 'destructive'}>
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {promo.description || '—'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {renderLastUsed(promo)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {renderCreatedAt(promo)}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
                        onClick={() => handleCopyToClipboard(promo.code)}
                      >
                        {copiedCode === promo.code ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
                        onClick={() => handleToggleStatus(promo.code, promo.isActive)}
                        disabled={statusMutationCode === promo.code}
                      >
                        {statusMutationCode === promo.code ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : promo.isActive ? (
                          <>
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromoCodeManager;
