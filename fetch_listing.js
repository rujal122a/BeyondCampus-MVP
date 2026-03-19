const fs = require('fs');
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4anNuZHhvZWZqdXVlY2djYnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NzQxMjUsImV4cCI6MjA4OTI1MDEyNX0._66vXCGh6f9OOnKzZUSw-ZfUxV_dot-08lIHPBYJzig";
const url = "https://qxjsndxoefjuuecgcbpj.supabase.co/rest/v1/listings?id=eq.b5ecebf9-6a8b-4285-b53f-f8d5eb02e469&select=image_urls";

fetch(url, {
  headers: {
    "apikey": apiKey,
    "Authorization": `Bearer ${apiKey}`
  }
})
.then(res => res.json())
.then(data => fs.writeFileSync('image_data.json', JSON.stringify(data, null, 2)))
.catch(console.error);
