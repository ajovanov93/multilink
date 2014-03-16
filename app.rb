set :public_folder, 'public'

get '/' do
	return File.read ("public/index.html")
end