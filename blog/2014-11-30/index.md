---
date: "2014-11-30"
title: "Adding Prism syntax highlighting to a Harp server"
category: "General"
---

This website ~~is~~ used to run on a webserver called [Harp](http://harpjs.com). While reading through the [documentation page](http://harpjs.com/docs/development/markdown) on using Markdown to write pages, I came across an interesting few lines near the bottom of the page, which discussed how to include fenced code blocks on a page:

>The language- class name follows the [W3C](http://www.w3.org/TR/html5/text-level-semantics.html#the-code-element) and [WHATWG](http://www.whatwg.org/specs/web-apps/current-work/multipage/text-level-semantics.html#the-code-element) convention for specifying the type of code. This also allows you to style it with a client-side syntax highlighting library, like [Prism](http://prismjs.com/).

What this means is that when you include code blocks, you can have Prism highlight the syntax for you just by specifying the language. This mimics the syntax highlighting behaviour of text editors such as [SublimeText](http://www.sublimetext.com/), and makes code blocks on your website easier to read and understand at a glance.

Installing Prism on a Harp webserver is relatively easy, but we'll quickly go over the steps to follow.

#### Downloading Prism


1. Navigate over to [prismjs.com](http://prismjs.com/)

2. After clicking download, you'll be presented with a list of options to choose from in order to customize your version of Prism. This includes themes, languages Prism will recognize, and even a handful of plugins.

3. Download the Javascript and CSS files provided at the bottom, and save them in a folder your webserver can access. For my part, I've placed both in a folder named prism.

#### Installing Prism

1. Now that we've dowloading the necessary files, we need to include both the Javascript and CSS files. For my part, I have a main.less file that Harp converts to CSS and a _layout.jade file the Harp converts to HTML. However, the same idea applies if you're using something like a main.css or _layout.ejs file.

2. In your main.less file, add the line `@import "path_to_prism.css/prism";` to the top of the file.

    Note: I had issues with importing into my main.less file a CSS file, and not a less file. Per the [lesscss.org documentation](http://lesscss.org/features/#import-options-css), there should no longer be an issue importing a CSS file, and [Harp v0.14.0](http://harpjs.com/blog/v0-14-0-implicit-autoprefixing) includes LESS version 1.7.4, however I still had issues. Changing the prism.css file extension to prism.less solved the problem for me though.

3. Finally, add the line `script(src="/path_to_prism.js/prism.js")` to your _layout.jade header block, or `<script type="text/javascript" src="/path_to_prism.js/prism.js"></script>` to your Javacript file.

#### Using Prism

1. Now that we've installed Prism, whenever we include code blocks such as the following:

```
<!DOCTYPE html>
<html>
    <head>
        <title>
            Example page title
        </title>
    </head>
    <body>
        <h1> Example header </h1>
    </body>
</html>
```

Prism can automatically highlight the syntax for us if  we add a language class to the code block. In Markdown, this can be simply added by including a language- class right after the three backticks used to open a code-block. For the above code block, we would make sure the line looked like this ````markup`, which will be converted to a `language-markup` class and render as so:

```markup
<!DOCTYPE html>
<html>
    <head>
        <title>
            Example page title
        </title>
    </head>
    <body>
        <h1> Example header </h1>
    </body>
</html>
```

And that's all there is to it!
