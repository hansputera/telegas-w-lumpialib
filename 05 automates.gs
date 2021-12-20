const r = /(http|https):\/\/(.*)\.tiktok\.com\/.+(\/)?/gi;

client.on('message', (ctx) => {
  const entities = ctx.message.entities;
  if (ctx.message.text && entities) {
    const filteredEntities = entities.filter((x) => x.type === 'url' && r.test(ctx.message.text.slice(x.offset, x.length)));
    filteredEntities.forEach((a) => {
      AnotherUtil.tiktok(ctx.message.text.slice(a.offset, a.length)).then((res) => {
        if (!res.error) {
          const blobVideo = UrlFetchApp.fetch(res.result.urls[0]).getBlob();
          ctx.telegram.sendVideo(ctx.chat.id, blobVideo, {
            'caption': 'Provider: ' + res.provider,
          });
        } else {
          ctx.reply('Getting an error from API: ' + res.error);
        }
      });
    });
  }
});
