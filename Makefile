all:
	# update npm version
	npm install -g npm
	# install dependencies
	npm ci
	# build
	npm run build
