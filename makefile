# Example
# make fetch-elld v=0.1.7-alpha
# Download ELLD for darwin
fetch-elld:
	curl -L https://github.com/ellcrys/elld/releases/download/v${v}/elld_${v}_darwin_x86_64.tar.gz \
		--output binaries/elld-darwin.tar.gz

# Download ELLD for linux
fetch-elld-linux:
	curl -L https://github.com/ellcrys/elld/releases/download/v${v}/elld_${v}_linux_x86_64.tar.gz \
		--output binaries/elld-linux.tar.gz

# Download ELLD for windows
fetch-elld-win:
	curl -L https://github.com/ellcrys/elld/releases/download/v${v}/elld_${v}_windows_x86_64.tar.gz \
		--output binaries/elld-windows.tar.gz
