# Basic JS crawler

## Usage

1. Drag the "JS Crawler" link on the right to your bookmark bar: [JS Crawler](javascript:(function()%7B%22use%20strict%22%3Bfunction%20Crawler()%7Bvar%20a%3D0%3Carguments.length%26%26arguments%5B0%5D!%3D%3Dvoid%200%3Farguments%5B0%5D%3A%7B%7D%3Bthis.limit%3Da.limit%7C%7C200%2Cthis.currentIteration%3D0%2Cthis.baseURL%3Da.baseURL%7C%7Cwindow.location.origin%2Cthis.currentURL%3Dnull%2Cthis.results%3D%7B%7D%2Cthis.queue%3D%5B%5D%2Cthis.trigger(%22crawl.start%22)%2Cthis.crawlURL(this.baseURL)%7DCrawler.prototype.listeners%3D%5B%5D%2CCrawler.prototype.on%3Dfunction(a%2Cb)%7Bthis.listeners.push(%7Bname%3Aa%2Ccallback%3Ab%7D)%7D%2CCrawler.prototype.trigger%3Dfunction(a)%7Bfor(var%20b%3Darguments.length%2Cc%3DArray(1%3Cb%3Fb-1%3A0)%2Cd%3D1%3Bd%3Cb%3Bd%2B%2B)c%5Bd-1%5D%3Darguments%5Bd%5D%3Bfor(var%20e%2Cf%3D0%3Bf%3Cthis.listeners.length%3Bf%2B%2B)e%3Dthis.listeners%5Bf%5D%2Ce.name%3D%3D%3Da%26%26%22function%22%3D%3Dtypeof%20e.callback%26%26e.callback.apply(e%2Cc)%7D%2CCrawler.prototype.cleanURL%3Dfunction(a)%7Bvar%20b%3Dthis.baseURL.replace(%2F%5C%2F%24%2Fi%2C%22%22)%2Cc%3Dthis.currentURL.replace(%2F%5C%2F%24%2Fi%2C%22%22)%2Cd%3Dnew%20RegExp(%22%5E%22%2Bfunction(a)%7Breturn%20a.replace(%2F%5B-%5C%2F%5C%5C%5E%24*%2B%3F.()%7C%5B%5C%5D%7B%7D%5D%2Fg%2C%22%5C%5C%24%26%22)%7D(b)%2B%22%5C%5C%2F%3F%22%2C%22i%22)%2Ce%3Dd.test(a)%3Breturn!e%26%26(%2F%5Ehttps%3F%3A%2Fi.test(a)%7C%7C%2F%5Ewww%5C.%2Fi.test(a)%7C%7C%2F%5E%23%2Fi.test(a))%3Fnull%3A(e%7C%7C%2F%5E%5C%2F%2Fi.test(a)%7C%7C(a%3Dc%2B%22%2F%22%2Ba)%2Ca%3Da.replace(d%2C%22%2F%22)%2Ca%3Da.replace(%2F%5E%5C%2F%2F%2C%22%22)%2Cb%2B%22%2F%22%2Ba)%7D%2CCrawler.prototype.run%3Dfunction()%7Bif(this.queue.length)for(var%20a%3D0%3Ba%3Cthis.queue.length%3Ba%2B%2B)%7Bvar%20b%3Dthis.cleanURL(this.queue%5Ba%5D)%2Cc%3Db%20in%20this.results%2Cd%3Db%26%26!c%3Bif((!b%7C%7Cc%7C%7Cd)%26%26this.queue.splice(a%2C1)%2Cd)return%20this.crawlURL(b)%2C!0%7Dreturn!1%7D%2CCrawler.prototype.crawlURL%3Dfunction(a)%7Bvar%20b%3Dthis%3Bthis.currentIteration%2B%2B%2Cb.currentURL%3Da%2Cb.results%5Ba%5D%3Dnull%2Cb.trigger(%22crawl.single.start%22%2Ca)%3Bvar%20c%3Dnew%20XMLHttpRequest%3Bc.open(%22GET%22%2Ca%2C!0)%2Cc.onload%3Dfunction()%7Bb.trigger(%22crawl.single.end%22%2Ca%2Cthis)%3Bvar%20c%3Dthis.status%2Cd%3Dthis.response%3Bif(b.results%5Ba%5D%3D%7Bstatus%3Ac%2Cresponse%3Ad%7D%2C200%3D%3D%3Dc)for(var%20e%3Dnew%20DOMParser().parseFromString(d%2C%22text%2Fhtml%22)%2Cf%3De.getElementsByTagName(%22a%22)%2Cg%3D0%3Bg%3Cf.length%3Bg%2B%2B)%7Bvar%20h%3Df%5Bg%5D%2Cj%3DArray.from(h.relList)%7C%7C%5B%5D%3Bif(-1%3D%3D%3Dj.indexOf(%22nofollow%22))%7Bvar%20k%3Db.cleanURL(h.href)%3Bk%26%26-1!%3D%3Dk.indexOf(b.baseURL)%26%26-1%3D%3D%3Db.queue.indexOf(h.href)%26%26b.queue.push(h.href)%7D%7Dvar%20l%3D-1!%3D%3Db.limit%26%26Object.keys(b.results).length%3Cb.limit%3Bl%26%26(l%3Db.run())%2Cl%7C%7Cb.trigger(%22crawl.end%22)%7D%2Cc.send()%7D%3Bvar%20crawlLimit%3DparseInt(prompt(%22Set%20the%20crawl%20limit%20with%20the%20field%20below.%20Set%20to%20%60-1%60%20for%20infinity%20URLs.%20Default%20is%20200.%22))%7C%7Cnull%2Crunner%3Dnew%20Crawler(%7Blimit%3AcrawlLimit%7D)%3Brunner.on(%22crawl.single.start%22%2Cfunction()%7Bconsole.log(%22%22.concat(runner.currentIteration%2C%22%2F%22).concat(runner.queue.length))%7D)%2Crunner.on(%22crawl.end%22%2Cfunction()%7Bvar%20a%3D%5B%22%3Ctable%20width%3D%5C%22100%25%5C%22%20cellpadding%3D%5C%225%5C%22%20cellspacing%3D%5C%222%5C%22%20border%3D%5C%221%5C%22%3E%22%2C%22%3Ctr%3E%22%2C%22%3Ctd%3EURL%3C%2Ftd%3E%22%2C%22%3Ctd%3EStatus%3C%2Ftd%3E%22%2C%22%3Ctd%3ETitle%3C%2Ftd%3E%22%2C%22%3Ctd%3EH1%3C%2Ftd%3E%22%2C%22%3C%2Ftr%3E%22%5D%3Bfor(var%20b%20in%20runner.results)%7Bvar%20c%3Drunner.results%5Bb%5D%2Cd%3D%22%22%2Ce%3D%22%22%3Bif(200%3D%3D%3Dc.status)%7Bvar%20f%3Dnew%20DOMParser().parseFromString(c.response%2C%22text%2Fhtml%22)%2Cg%3Df.querySelector(%22title%22)%2Ch%3Df.getElementsByTagName(%22h1%22)%3Bg%26%26(d%3Dg.innerText)%2Ch.length%26%26h%5B0%5D%26%26(e%3Dh%5B0%5D.innerText)%7Da.push(%22%3Ctr%3E%22)%2Ca.push(%22%3Ctd%3E%22.concat(b%2C%22%3C%2Ftd%3E%22))%2Ca.push(%22%3Ctd%3E%22.concat(c.status%2C%22%3C%2Ftd%3E%22))%2Ca.push(%22%3Ctd%3E%22.concat(d%2C%22%3C%2Ftd%3E%22))%2Ca.push(%22%3Ctd%3E%22.concat(e%2C%22%3C%2Ftd%3E%22))%2Ca.push(%22%3C%2Ftr%3E%22)%7Da.push(%22%3C%2Ftable%3E%22)%3Bvar%20i%3Dwindow.open()%3Bi.document.write(a.join(%22%22))%2Ci.focus()%7D)%3B%7D)()%3B)
2. Load a web-page which you wish to crawl
3. Click "JS Crawler" in your bookmark bar
4. Leave the page open until the crawl has completed

Currently there is no visual aid to the crawl but basic stats can be found in the developer console.

## Example
![Usage example](https://i.imgur.com/DAw4Mxh.gif)
