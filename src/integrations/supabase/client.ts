/* eslint-disable @typescript-eslint/no-explicit-any */
// Frontend-only mock of Supabase client. Replaces live Supabase with in-memory data.
// Keep the same import path so the rest of the app works unchanged.

type Row = Record<string, any>;

const MOCK_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'dev@example.com'
};

// In-memory mock data
const db = {
  user_profiles: [
    { id: MOCK_USER.id, email: MOCK_USER.email, subscription_status: 'active' },
    { id: '00000000-0000-0000-0000-000000000002', email: 'member2@example.com', subscription_status: 'trial' },
    { id: '00000000-0000-0000-0000-000000000003', email: 'member3@example.com', subscription_status: 'active' },
  ] as Row[],
  profiles: [
    { user_id: MOCK_USER.id, avatar_url: null, display_name: 'Dev User', first_name: 'Dev', last_name: 'User', bio: 'Mock profile', profile_complete: true },
  ] as Row[],
  discussions: [
    {
      id: 'd1',
      title: 'Welcome to the Community',
      content: 'Say hello and share your goals!',
      author_name: 'Admin (Admin)',
      author_avatar: null,
      category: 'General',
      likes_count: 5,
      comments_count: 2,
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      user_id: MOCK_USER.id,
      is_pinned: true,
    },
    {
      id: 'd2',
      title: 'Your first win',
      content: 'Share your first closed deal or key learning.',
      author_name: 'Dev User',
      author_avatar: null,
      category: 'Wins',
      likes_count: 3,
      comments_count: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      user_id: MOCK_USER.id,
      is_pinned: false,
    },
  ] as Row[],
  direct_messages: [
    {
      id: 'm1',
      sender_id: MOCK_USER.id,
      recipient_id: '00000000-0000-0000-0000-000000000002',
      sender_name: 'Dev User',
      message: 'Welcome aboard! Let me know if you need help.',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read_at: null,
    }
  ] as Row[],
  user_roles: [
    { user_id: MOCK_USER.id, role: 'admin' },
  ] as Row[],
};

function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

function applyFilters(rows: Row[], filters: Array<{ type: 'eq' | 'in'; field: string; value: any }>) {
  return rows.filter(row => {
    return filters.every(f => {
      if (f.type === 'eq') return row[f.field] === f.value;
      if (f.type === 'in') return Array.isArray(f.value) && f.value.includes(row[f.field]);
      return true;
    });
  });
}

function applyOrder(rows: Row[], orderings: Array<{ field: string; ascending: boolean }>) {
  if (!orderings.length) return rows;
  const sorted = [...rows];
  sorted.sort((a, b) => {
    for (const ord of orderings) {
      const av = a[ord.field];
      const bv = b[ord.field];
      if (av == null && bv == null) continue;
      if (av == null) return ord.ascending ? -1 : 1;
      if (bv == null) return ord.ascending ? 1 : -1;
      if (av < bv) return ord.ascending ? -1 : 1;
      if (av > bv) return ord.ascending ? 1 : -1;
    }
    return 0;
  });
  return sorted;
}

function makeSelectResult(data: any, options?: { count?: 'exact'; head?: boolean }) {
  if (options?.head) {
    const count = Array.isArray(data) ? data.length : (data ? 1 : 0);
    return Promise.resolve({ data: null, count, error: null });
  }
  return Promise.resolve({ data: clone(data), error: null });
}

function createQueryBuilder(table: keyof typeof db) {
  const filters: Array<{ type: 'eq' | 'in'; field: string; value: any }> = [];
  const orderings: Array<{ field: string; ascending: boolean }> = [];
  let op: 'select' | 'insert' | 'update' | 'delete' | null = null;
  let payload: any = null;
  let selectOptions: any = {};

  const builder: any = {
    select: (columns: string = '*', options?: any) => {
      op = 'select';
      selectOptions = options || {};
      return builder;
    },
    upsert: (values: Row | Row[], options?: { onConflict?: string }) => {
      op = 'insert';
      const rows = Array.isArray(values) ? values : [values];
      const onConflictKey = options?.onConflict;
      const selectFn = () => {
        const result: Row[] = [];
        const tableRows = db[table] as Row[];
        for (const incoming of rows) {
          let matched: Row | undefined;
          if (onConflictKey && incoming[onConflictKey] != null) {
            matched = tableRows.find(r => r[onConflictKey] === incoming[onConflictKey]);
          }
          if (matched) {
            Object.assign(matched, incoming);
            result.push(clone(matched));
          } else {
            const newRow = { ...incoming };
            if (!newRow.id) newRow.id = String(Date.now());
            tableRows.push(newRow);
            result.push(clone(newRow));
          }
        }
        const promise: any = Promise.resolve({ data: result, error: null });
        promise.single = async () => {
          const res = await promise;
          return { data: Array.isArray(res.data) ? res.data[0] : res.data, error: null };
        };
        return promise;
      };
      return { select: selectFn };
    },
    insert: (values: Row | Row[]) => {
      op = 'insert';
      payload = Array.isArray(values) ? values : [values];
      // Return an object that supports .select().single()
      const selectFn = () => {
        const inserted = payload.map((row: Row) => {
          const newRow = { ...row };
          if (!newRow.id) newRow.id = String(Date.now());
          (db[table] as Row[]).push(newRow);
          return newRow;
        });
        const promise: any = Promise.resolve({ data: inserted, error: null });
        promise.single = async () => {
          const res = await promise;
          return { data: Array.isArray(res.data) ? res.data[0] : res.data, error: null };
        };
        return promise;
      };
      return { select: selectFn };
    },
    update: (values: Row) => {
      op = 'update';
      payload = values;
      const api: any = {
        eq: (field: string, value: any) => {
          filters.push({ type: 'eq', field, value });
          api._filtersApplied = true;
          return api;
        },
        select: () => {
          const all = db[table] as Row[];
          const matched = applyFilters(all, filters);
          matched.forEach(row => Object.assign(row, payload));
          const promise: any = Promise.resolve({ data: clone(matched), error: null });
          promise.single = async () => {
            const res = await promise;
            return { data: Array.isArray(res.data) ? res.data[0] : res.data, error: null };
          };
          return promise;
        }
      };
      return api;
    },
    delete: () => {
      op = 'delete';
      const api: any = {
        eq: (field: string, value: any) => {
          filters.push({ type: 'eq', field, value });
          return api;
        },
        select: () => {
          const all = db[table] as Row[];
          const remaining: Row[] = [];
          const deleted: Row[] = [];
          for (const row of all) {
            if (applyFilters([row], filters).length) deleted.push(row); else remaining.push(row);
          }
          (db[table] as Row[]).length = 0;
          (db[table] as Row[]).push(...remaining);
          return Promise.resolve({ data: clone(deleted), error: null });
        }
      };
      return api;
    },
    eq: (field: string, value: any) => {
      filters.push({ type: 'eq', field, value });
      return builder;
    },
    is: (field: string, value: any) => {
      // Treat .is(field, null) same as equality to null
      filters.push({ type: 'eq', field, value });
      return builder;
    },
    in: (field: string, values: any[]) => {
      filters.push({ type: 'in', field, value: values });
      return builder;
    },
    order: (field: string, opts?: { ascending?: boolean }) => {
      orderings.push({ field, ascending: opts?.ascending !== false });
      return builder;
    },
    single: async () => {
      const res = await builder._exec();
      return { data: Array.isArray(res.data) ? res.data[0] : res.data, error: null };
    },
    maybeSingle: async () => {
      const res = await builder._exec();
      const data = Array.isArray(res.data) ? (res.data[0] ?? null) : (res.data ?? null);
      return { data, error: null };
    },
    _exec: async () => {
      const all = db[table] as Row[];
      if (op === 'select' || op === null) {
        const filtered = applyFilters(all, filters);
        const sorted = applyOrder(filtered, orderings);
        return makeSelectResult(sorted, selectOptions as any);
      }
      // Fallback
      return Promise.resolve({ data: null, error: null });
    }
  };
  return builder;
}

const mockAuth = {
  async getSession() {
    return { data: { session: { user: { id: MOCK_USER.id, email: MOCK_USER.email }, access_token: 'mock-token' } }, error: null };
  },
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const session = { user: { id: MOCK_USER.id, email: MOCK_USER.email }, access_token: 'mock-token' };
    setTimeout(() => callback('SIGNED_IN', session), 0);
    return { data: { subscription: { unsubscribe() {} } } } as any;
  },
  async signInWithPassword({ email }: { email: string; password: string }) {
    const user = { id: MOCK_USER.id, email: email || MOCK_USER.email };
    return { data: { user, session: { user, access_token: 'mock-token' } }, error: null } as any;
  },
  async signUp({ email }: { email: string; password: string; options?: any }) {
    const user = { id: MOCK_USER.id, email };
    return { data: { user, session: { user, access_token: 'mock-token' } }, error: null } as any;
  },
  async signOut(_opts?: any) {
    return { error: null } as any;
  },
  async resetPasswordForEmail(_email: string, _opts?: any) {
    return { data: {}, error: null } as any;
  }
};

const mockFunctions = {
  async invoke(name: string, _args?: any) {
    if (name === 'check-subscription') {
      return { data: { subscribed: true, subscription_tier: 'Premium' }, error: null };
    }
    if (name === 'create-checkout') {
      return { data: { url: 'https://example.com/checkout' }, error: null };
    }
    if (name === 'customer-portal') {
      return { data: { url: 'https://example.com/portal' }, error: null };
    }
    if (name === 'notify-new-user') {
      return { data: { ok: true }, error: null };
    }
    return { data: {}, error: null };
  }
};

const mockStorage = {
  from(bucket: string) {
    return {
      async upload(path: string, _file: File, _opts?: any) {
        return { data: { path: `${bucket}/${path}` }, error: null } as any;
      },
      getPublicUrl(path: string) {
        const publicUrl = `https://picsum.photos/seed/${encodeURIComponent(bucket + '-' + path)}/600/400`;
        return { data: { publicUrl } } as any;
      }
    };
  }
};

const mockRealtime = {
  channel(_name: string) {
    const api: any = {
      on(_event: any, _filter: any, _callback: any) { return api; },
      subscribe() { return { unsubscribe() {} }; }
    };
    return api;
  },
  removeChannel(_channel: any) {}
};

export const supabase: any = {
  auth: mockAuth,
  functions: mockFunctions,
  storage: mockStorage,
  channel: mockRealtime.channel,
  removeChannel: mockRealtime.removeChannel,
  from: (table: keyof typeof db) => createQueryBuilder(table),
};