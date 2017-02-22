# Material Flow

Yet Another Material-Design-Style Hexo Theme.[DEMO](http://keyin.me)  

![Desktop](https://raw.githubusercontent.com/stkevintan/hexo-theme-material-flow/master/snapshots/desktopv2.png)

## Installation
### Dependencies
```bash
cd /your_blog_dir/
npm i -S hexo-generator-search hexo-generator-feed hexo-renderer-less hexo-autoprefixer hexo-generator-json-content
```
### Downloading Source
```bash
cd /your_blog_dir/themes/
git clone https://github.com/stkevintan/hexo-theme-material-flow material-flow
```
### Configuration
1. Change the value of `theme` to material-flow in your global `_config.yml`.
2. Put your avatar && favicon  images to `/source/images/`



## Settings

There are 3 configuration places you should concerned:

### `_config.yml`  
The global config of your site.
```yaml
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: YOUR_TITLE
subtitle: YOUR_SUBTITLE
description: YOUR_DESC
keywords:
  - A_KEYWORD
  - A_KEYWORD
author: YOUR_NAME
avatar: /images/avatar.jpg  # the avatar image in the sidebar
favicon: /images/favicon.ico # the favicon
language: zh-CN
timezone: Asia/Shanghai

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: YOUR_SITE
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:

## ....


disqus_shortname: your_disqus_shortname
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: material-flow

# if your search is enable && search service is 'hexo'
search:
  path: search.xml
  field: post

# Generator json content
jsonContent:
  meta: false
  keywords: false
  pages:
    title: true
    slug: false
    date: false
    updated: false
    comments: false
    path: false
    link: false
    permalink: true
    excerpt: false
    keywords: false
    text: true
    raw: false
    content: false
  posts:
    title: true
    slug: false
    date: false
    updated: false
    comments: false
    path: false
    link: false
    permalink: true
    excerpt: false
    keywords: false
    text: true
    raw: false
    content: false
    categories: false
    tags: false

# auto prefixer
autoprefixer:
  exclude:
    - '*.min.css'
  browsers:
    - 'last 2 versions'

# rss
feed:
  type: atom
  path: atom.xml
  limit: 20
  hub:
  content:
```

## `source/_data/`
The site config file directory. Following 3 configuration files are required:
### `links.yml` 
Defines the entries of your external link, eg:
```yaml
- name: blog1
  url: https://xxxx.com
- name: blog2
  url: http://xxx.com/
- name: blog3
  url: http://xxx.io/
```

### `menu.yml` 
Defines the navigation menu of the header, eg:
```yaml
- name: Home
  slug: home
  url: /
- name: Archives
  slug: archives
  url: /archives
- name: About
  slug: about
  url: /about
```

### `widgets.yml`
Defines the widget to show in the sidebar, eg:
```yaml
- about
- friendly-links
- categories
- tagcloud
```


## `themes/material-flow/_config.yml` 
The theme config file.
```yaml
# Search
search: 
  enable: true
  service: hexo # avaliable options : google/hexo/algolia/azure/baidu
  # google 
  google_api_key:
  google_engine_id:
  # algolia
  algolia_app_id:
  algolia_api_key:
  algolia_index_name:
  # azure
  azure_service_name:
  azure_index_name:
  azure_query_key:
  # baidu
  baidu_api_id:


# Less
less:
  compress: true

# use url, not username
social:
- slug: github
  url: https://github.com/YOUR_GITHUB_ID
- slug: twitter
  url: https://twitter.com/YOUR_TWTTIER_ID
- slug: rss
	url: /atom.xml
```



## Enjoy ;)