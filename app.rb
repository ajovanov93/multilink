set :public_folder, 'public'

get '/' do
	return File.read (File.join "public", "index.html")
end