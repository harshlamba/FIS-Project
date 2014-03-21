FIS - Project Enviorment For UX
=======

## Development

### Dependency Management & Install

SASS Compilation requires Ruby. Check [The Ruby Installation
Guide](https://www.ruby-lang.org/en/installation/) for details. Ruby 1.9.3 or
greater is recommended. You will also need a few Ruby packages [Gems for RubyGems](https://rubygems.org/pages/download).
Once you have Ruby installed you will need Command Line Access to get the RubyGems & SASS. Run the following command inside the Extend directory:

    $ gem install rubygems #this is optional if RubyGems are already installed
    $ gem update --system    

Because we are using source mapping in SASS conversions we require you use SASS version 3.3.0 or greater. The Bundler gem handles this for you using our Gemfile (bundle install). Set sourcemap to false in the Grunt plugin if you don't care forthis feature.

To run the required JavaScript development environment you will need to install [Node.js](http://nodejs.org/download/) with NPM (The Node Package Manager). NPM should be bundled with Node but just double check.

Once you have Node & NPM installed you can run the following to install Bower & Grunt globally. Then install "all of the things".

    $ npm install -g bower			# installs bower globally
    $ npm install -g grunt-cli		# installs grunt command line interface globally
    $ npm update && bower update	# Download dependent files for the development

###Task list

	1. build : Task includes compilation of sass, can combine different css file together and 
			   will minify the css to destination folder.
	2. watch-sass : Task to watch over the sass file while developement.