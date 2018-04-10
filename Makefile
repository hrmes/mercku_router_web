all:
	npm install
	npm run build

clean:
	rm -rf package-lock.json
	rm -rf node-modules
