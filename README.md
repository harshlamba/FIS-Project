FIS - Project Enviorment For UX
=======

Extend is a framitecture (Part framework & Part architecture). Design is used as a identity for a product, extend gives you the power to decide what you want for your product. You can combine components from different libraries that you like or create your own components where you feel the need. 

This also tries to tackle the problem of not being the lowest common denominator. You don't have to be pulled down by the library you use. If your application is wireframing tool aimed for designers and you know your user base is on Macs with latest browsers why be stuck with a bootstrap grid system? This gives you the power to decide what you should support rather than the library or framework.  

### Architecture
    Base | Theme
         |
         --- Modules
                |
                --- Components
                        |
                        --- Layouts
                               |
                               --- Views

#### Base
This is the core foundation of your application. 

Example of Base
* Normalize
* Typography
* Grid System

#### Theme
Theme contains the top most coat of design for your application. 

Example of Theme
* Colors

#### Modules
These are re-usable elements at there most basic atomic unit but sufficiently complete to be used independently, with other modules or with components.

Example of Modules
* Buttons 
* Input Elements
* Icons
* Image

#### Components
Componets are modular re-usable parts of our design. They are made by using one or more modules together. Componets can often extend themselves.

    Component X
        |
        --- X.1
        --- x.2
        --- x.3

Example of Components

    Nav
     |
     --- Menu
     --- Pagination
     
    Popup
     |
     --- tooltip
     --- popover
     --- growl-notifications
     
Forms

#### Layouts
Layouts are sections of your page with hold components together.

Example of Layouts
* Header
* Filters
* Masthead

#### Views
Views are the end pages of your application. These are the final wrappers of everything. A page inside a application can contain one or more views.

### Variables
Each part is like a class, thus variable definition is important and to be defined separately but within the scope of the part. Structurally this could at the top of the file or in a separate file within the folder of that part.
You could define a function as a constructor with default variable which can be modified when the constructor is called.

### States
It is import to follow common semantics for states as this would be a interface for your javascript to interact with the code. Once you are free to modify the semantics as comfortable with the team but it needs to be defined and followed across.

Example of states
* Hidden
* Expanded
* Active

### Icons
Icons can be used as fonts. But it is suggested that they are used as ligatures.
icomatic.io is tool that allows you to import your SVG icons to create web-fonts and create/modify the ligatures for them as per your semantics.

### Typography

- Use a modular scale for your typography.
- Use unit-less numbers for line-height. [Why unit-less?](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height)

### Ecosystem
The higher you are in the chain, more likely you are to find the required parts. Normalize for base for instance is a separate project used by many mainstream front-end libraries. On the other-hand your views would be something that you will most likely create yourself.

### Features

#### Colors
* Warning on below threshold contrast with auto inverse.

#### Vertical Rhythm
* To maintain vertical rhythm it is prefered to specify borders as box-shadows

### Author

**Adi Chikara**

- aditya.chhikara@3pillarglobal.com
- http://twitter.com/adi_ads


### References and good reads
* [Meaningful Typography](http://alistapart.com/article/more-meaningful-typography)
* [Atomic Design System](http://pattern-lab.info/)
* [Responsive Deliverables](http://daverupert.com/2013/04/responsive-deliverables/)
* [Responsive Resources](http://bradfrost.github.io/this-is-responsive/resources.html)
* [BEM Methodology](http://bem.info/method/)
* [Smacss](http://smacss.com/)

## Development

### Dependency Management & Install

SASS Compilation requires Ruby. Check [The Ruby Installation
Guide](https://www.ruby-lang.org/en/installation/) for details. Ruby 1.9.3 or
greater is recommended. You will also need a few Ruby packages [Gems for RubyGems](https://rubygems.org/pages/download).
Once you have Ruby installed you will need Command Line Access to get the RubyGems & SASS. Run the following command inside the Extend directory:

    $ gem install rubygems #this is optional if RubyGems are already installed
    $ gem update --system
    $ bundle install

Because we are using source mapping in SASS conversions we require you use SASS version 3.3.0 or greater. The Bundler gem handles this for you using our Gemfile (bundle install). Set sourcemap to false in the Grunt plugin if you don't care forthis feature.

To run the required JavaScript development environment you will need to install [Node.js](http://nodejs.org/download/) with NPM (The Node Package Manager). NPM should be bundled with Node but just double check.

Once you have Node & NPM installed you can run the following to install Bower & Grunt globally. Then install "all of the things".

    $ npm install -g bower     # installs bower globally
    $ npm install -g grunt-cli # installs grunt command line interface globally
    $ npm install && bower install
