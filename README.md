# react-scanner

A CLI utility and library for finding and gathering info about react components on any given web page.

## Notes

### Initial spike

* Started out by wroting all my own code because browser globals and Puppeteer.
* I was able to traverse the tree using information stored on the DOM nodes.
* I got to the point to where a node was dynamically rendering content but couldn't traverse children from that point, even if I waited.
* There's very little information on the internal data and nobody has responded to any questions I've had about how to do this.
* The first part of this involved traversing the DOM tree and getting the component that represents each one, if it has one. This is a solid way to see what component represents a DOM node, but the problem with it is that you're not seeing the whole picture. You'll miss out on components that don't generate DOM for their respective components, such as analytics and layering.
* The second part of this involved traversing the "react tree" from the root instead of the DOM tree. This gave me deeper insight into the react tree, but I wasn't able to get past the dynamically loaded content.

_This method only yielded the usage of a single component on the Atlaskit website: `AkPage`. This is because it's the only component that defines a `dipslayName` and other information isn't as relaiable, but some info can be gleaned from them._

### Second spike

* Deleted all my bespoke code to try and use other libraries like `react-tree-walker` and `react-dom/test-utils`.
* 🐃 Still ended up having to write code that found the render roots.
* 🐃 Had to bundle up code so I could consume dependencies.
* 🐞 `react-tree-walker` kept giving me errors and since this is in puppeteer, and inside of a Promise, this is super hard to debug without shaving more yaks. The error was something like `cannot access property router on undefined`. You had to pass in the `root.child` object for this to start working.
* Switched to using `react-dom/test-utils` and the `findAllInRenderedTree()` function. You have to pass in the `root.child.child.stateNode` property. Got error `Object couldn't be returned by value undefined`.

### Next steps

* I want to see if there's a hybrid approach where we can traverse both the internal react tree, `children` props and the real DOM tree and somehow piece that together. The libraries I've tried _should_ do this but are erroring out for cryptic reasons.
* I don't know. It feels like I've exhausted the viable options. Most information on this subject is in the context of testing, as opposed to scraping DOMs. In those scenarios, the recommendation has always been "don't use the DOM as the source of truth." However, we _need_ to do this to get real world usage.
* An alternative approach might be to hit `package.json` files directly and see if certain deps are in them, but this doesn't represent real-world usage because you're just seening what's there.

