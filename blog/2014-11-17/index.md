---
date: "2014-11-17"
title: "A lesson learned in including javascript libraries properly"
category: "Programming"
---

I figured I'd sit down and quickly add a navigation header to my site just to have it in place, so that I could add links to it later.

After reading over the Bootstrap documentation, I thought it seemed rather straight-forward, so I quickly whipped up a few lines of [Jade](http://jade-lang.com/) into a serviceable navigation header with a few link elements in it — one to the homepage and one to the blog portion.

_(As a quick side note, I'm really enjoying using [Jade](http://jade-lang.com/), if only for the fact that it helps avoid the pesky problem of forgetting closing div and span tags.)_

Satisfied with the look of the navigation header, I resized my browser and the navigation did indeed collapse just like the documentation advertised, and I was pretty pleased with how simple it had all been.

"Just a matter of including the Bootstrap javascript libraries and any dependencies and we'll be all set." I thought to myself. So I downloaded the compiled javascript files provided by bootcamp and added them to a folder in my harp server directory, and appended these two lines near the top of my layout.jade document at the root of my server.

```javascript
script(src="/js/bootstrap.min.js")
script(src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js")
```

"Simple," I thought "the precompiled Bootstrap css is right on my server and the jquery is just served by Google's CDN."

But when I ran the harp server command from the terminal, the supposedly now collapseable navigation — the navigation still didn't collapse. So of course my first thought was that I referencing an incorrect id in my layout.jade file, or that I was somehow calling a javascript plugin with the wrong name.

I carefully reread the documentation, checking each id and plugin name. It seemed okay to me. Next, I searched for a separate source of documentation. I found a few articles and even a youtube video, but it really seemed like I had added the lines properly for the navigation header to work.

Finally, I figured I'd just comment out all my navigation code and shoehorn in Bootstrap's pure HTML into my layout.jade. Aha! It didn't work either, so I double-checked the two lines of code I had added earlier to include the necessary javascript libraries. I could see that my server was serving them correctly, because they were properly included in the page source. But, crucially, I had messed up the order in which I had added the two files. I quickly switched the order:

```javascript
script(src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js")
script(src="/js/bootstrap.min.js")
```

And suddenly everything was up and running as it should.

Lesson learned: Include javascript dependencies *before* the plugin file itself.

<small> And also maybe don't work on code when I'm sorely in need of some sleep. </small>
