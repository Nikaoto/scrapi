# Scrapi
Scraping API for [Slami](https://github.com/Nikaoto/slami-react)

# Endpoints
Heroku endpoint: https://scr-api.herokuapp.com/

Default local endpoint: http://localhost:2000/

# Sending image requests

Route `/images` takes a GET request and a query object with `query` for the image search.

**Sample fetch request:**
```javascript
fetch("https://slami-bing-api.herokuapp.com/images?query=dog")
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.log(err))
```

The returned JSON should look like this:
```json
{
  "url": "http://www.quickanddirtytips.com/sites/default/files/images/2887/Dog_Chew.jpg",
  "title": "The Dog Trainer : Pica: Eating Things That Aren’t Food ...",
  "thumbnailUrl": "https://tse2.mm.bing.net/th?id=OIP.Lb9--l6XDyJV6RwC5fDEiwHaE7&pithumb.jpg",
  "source": "http://www.quickanddirtytips.com/pets/dog-behavior/pica-eating-things-that-aren%E2%80%99t-food"
}
```

# Sending proxy CORS requests

Route `/proxy` takes a GET request and a query obj with `url` as the image URL.

Returns a stream of the image with given URL.

**Example:**
```html
<img src="https://scr-api.herokuapp.com/proxy?url=https://http.cat/100.jpg" alt="cat" />
```

# Note
The server has full CORS enabled
