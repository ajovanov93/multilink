get '/' do
	return File.read ("Public/index.html")
end