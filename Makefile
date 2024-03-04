commit:
	npm run format
	npm run lint
	git add -A
	./commit.sh
	git push --no-verify
