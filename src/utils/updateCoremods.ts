import { Database } from "bun:sqlite";

const db = new Database("settings.sqlite");

export function update(data: {
  red4ext: { latestRelease: { tagName: any; updatedAt: any; url: any } };
  archivexl: { latestRelease: { tagName: any; updatedAt: any; url: any } };
  tweakxl: { latestRelease: { tagName: any; updatedAt: any; url: any } };
  codeware: { latestRelease: { tagName: any; updatedAt: any; url: any } };
  cet: { latestRelease: { tagName: any; updatedAt: any; url: any } };
  redscript: { latestRelease: { tagName: any; updatedAt: any; url: any } };
}) {
  const firstRunOrUpdate = db.query(`SELECT * FROM coremods`).run();

  if (firstRunOrUpdate) {
    db.query(`DELETE FROM coremods`).run();
  }

  const insert = db.query(
    `INSERT INTO coremods (tagName, version, updatedat, url) VALUES ($tagName, $version, $updatedat, $url);`
  );

  const intertmany = db.transaction((coremods) => {
    for (const mod of coremods) insert.run(mod);
  });

  intertmany([
    {
      $tagName: "red4ext",
      $version: data.red4ext.latestRelease.tagName,
      $updatedat: data.red4ext.latestRelease.updatedAt,
      $url: data.red4ext.latestRelease.url,
    },
    {
      $tagName: "archivexl",
      $version: data.archivexl.latestRelease.tagName,
      $updatedat: data.archivexl.latestRelease.updatedAt,
      $url: data.archivexl.latestRelease.url,
    },
    {
      $tagName: "tweakxl",
      $version: data.tweakxl.latestRelease.tagName,
      $updatedat: data.tweakxl.latestRelease.updatedAt,
      $url: data.tweakxl.latestRelease.url,
    },
    {
      $tagName: "codeware",
      $version: data.codeware.latestRelease.tagName,
      $updatedat: data.codeware.latestRelease.updatedAt,
      $url: data.codeware.latestRelease.url,
    },
    {
      $tagName: "cet",
      $version: data.cet.latestRelease.tagName,
      $updatedat: data.cet.latestRelease.updatedAt,
      $url: data.cet.latestRelease.url,
    },
    {
      $tagName: "redscript",
      $version: data.redscript.latestRelease.tagName,
      $updatedat: data.redscript.latestRelease.updatedAt,
      $url: data.redscript.latestRelease.url,
    },
  ]);

  db.close();
}
