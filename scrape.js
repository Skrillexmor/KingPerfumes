const fs = require('fs');
fetch('https://unsplash.com/s/photos/perfume-bottle')
  .then(r => r.text())
  .then(html => {
     const matches = html.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g);
     if(matches) {
       const unique = [...new Set(matches)];
       fs.writeFileSync('unsplash_ids.json', JSON.stringify(unique.slice(0, 30), null, 2));
       console.log("Success! Extracted " + unique.length + " IDs.");
     } else {
       console.log("No matches found");
     }
  });
