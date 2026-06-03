import { supabase } from "./supabase";

export const storage = {
  async getAll(table) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) { console.error("getAll error:", error); return []; }
    return data;
  },

  async set(table, id, row) {
    const { error } = await supabase.from(table).upsert(row);
    if (error) console.error("set error:", error);
  },

  async update(table, id, changes) {
    const { error } = await supabase.from(table).update(changes).eq("id", id);
    if (error) console.error("update error:", error);
  },

  async remove(table, id) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) console.error("remove error:", error);
  },

  // Supabase real-time listener
  listen(table, callback) {
    // First load
    storage.getAll(table).then(callback);

    // Subscribe to changes
    const channel = supabase
      .channel(`${table}-changes`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        storage.getAll(table).then(callback);
      })
      .subscribe();

    // Return unsubscribe function
    return () => supabase.removeChannel(channel);
  },
};