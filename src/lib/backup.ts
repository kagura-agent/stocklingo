"use client";

export function exportData(): void {
  if (typeof window === "undefined") return;
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("stocklingo")) {
      data[key] = localStorage.getItem(key)!;
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `stocklingo-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (typeof data !== "object" || data === null) {
          reject(new Error("无效的备份文件"));
          return;
        }
        for (const [key, value] of Object.entries(data)) {
          if (typeof key === "string" && typeof value === "string") {
            localStorage.setItem(key, value);
          }
        }
        resolve();
      } catch {
        reject(new Error("无效的 JSON 文件"));
      }
    };
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsText(file);
  });
}
