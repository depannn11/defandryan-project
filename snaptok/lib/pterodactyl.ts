// lib/pterodactyl.ts
// Baca & tulis file JSON di Pterodactyl server via Wings File API

const PANEL    = "https://defandryan.shanydev.web.id";
const PLTA     = "ptla_4CarLMQG8jYgONUOlDMntT0GcQTjnpJ7Ay1uAn2n8CU"; // Application key
const PLTC     = "ptlc_rzH9eSfc0yripONRykpXbjz4q3djmOW3wkMIOwj259m"; // Client key
const SERVER   = "17"; // server numeric ID
const BASE_DIR = "/snaptok/users"; // folder di dalam server

// ── Wings base URL (client API) ──────────────────────────────────────────────
// Pterodactyl client API untuk file operations pakai client key
const CLIENT = `${PANEL}/api/client/servers`;

// Get server UUID dari numeric ID pakai application API
let _serverUUID: string | null = null;
async function getServerUUID(): Promise<string> {
  if (_serverUUID) return _serverUUID;
  const res = await fetch(`${PANEL}/api/application/servers/${SERVER}`, {
    headers: {
      Authorization: `Bearer ${PLTA}`,
      Accept:        "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Pterodactyl getUUID failed: ${res.status}`);
  const json = await res.json();
  _serverUUID = json.attributes.identifier as string;
  return _serverUUID;
}

// ── Read file ─────────────────────────────────────────────────────────────────
export async function readUserFile(filename: string): Promise<Record<string, unknown> | null> {
  try {
    const uuid = await getServerUUID();
    const path = encodeURIComponent(`${BASE_DIR}/${filename}`);
    const res  = await fetch(`${CLIENT}/${uuid}/files/contents?file=${path}`, {
      headers: {
        Authorization: `Bearer ${PLTC}`,
        Accept:        "application/json",
      },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Read failed: ${res.status}`);
    const text = await res.text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ── Write file ────────────────────────────────────────────────────────────────
export async function writeUserFile(filename: string, data: Record<string, unknown>): Promise<boolean> {
  try {
    const uuid = await getServerUUID();
    // Pterodactyl write file pakai multipart/form-data
    const path    = `${BASE_DIR}/${filename}`;
    const content = JSON.stringify(data, null, 2);

    // Create/overwrite file
    const formData = new FormData();
    formData.append("files", new Blob([content], { type: "application/json" }), filename);

    // First ensure directory exists
    await fetch(`${CLIENT}/${uuid}/files/create-folder`, {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${PLTC}`,
        Accept:         "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ root: "/snaptok", name: "users" }),
    }).catch(() => {}); // ignore if already exists

    // Write file via upload endpoint
    const uploadRes = await fetch(
      `${CLIENT}/${uuid}/files/upload?directory=${encodeURIComponent(BASE_DIR)}`,
      {
        method:  "POST",
        headers: { Authorization: `Bearer ${PLTC}`, Accept: "application/json" },
        body:    formData,
      }
    );

    // Pterodactyl returns 200 for upload URL, then we POST to that URL
    if (uploadRes.ok) {
      const { attributes } = await uploadRes.json().catch(() => ({}));
      if (attributes?.url) {
        const up = await fetch(attributes.url, {
          method: "POST",
          body:   formData,
        });
        return up.ok;
      }
    }

    // Fallback: pakai write endpoint
    const writeRes = await fetch(`${CLIENT}/${uuid}/files/write?file=${encodeURIComponent(path)}`, {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${PLTC}`,
        Accept:         "application/json",
        "Content-Type": "text/plain",
      },
      body: content,
    });
    return writeRes.ok;
  } catch {
    return false;
  }
}

// ── Delete file ───────────────────────────────────────────────────────────────
export async function deleteUserFile(filename: string): Promise<boolean> {
  try {
    const uuid = await getServerUUID();
    const path = `${BASE_DIR}/${filename}`;
    const res  = await fetch(`${CLIENT}/${uuid}/files/delete`, {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${PLTC}`,
        Accept:         "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ root: BASE_DIR, files: [filename] }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── List all users (for admin) ────────────────────────────────────────────────
export async function listUserFiles(): Promise<string[]> {
  try {
    const uuid = await getServerUUID();
    const path = encodeURIComponent(BASE_DIR);
    const res  = await fetch(`${CLIENT}/${uuid}/files/list?directory=${path}`, {
      headers: {
        Authorization: `Bearer ${PLTC}`,
        Accept:        "application/json",
      },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? [])
      .filter((f: Record<string,unknown>) => (f.attributes as Record<string,unknown>)?.name?.toString().endsWith(".json"))
      .map((f: Record<string,unknown>) => (f.attributes as Record<string,string>).name);
  } catch {
    return [];
  }
}
