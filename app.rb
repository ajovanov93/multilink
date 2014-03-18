set :public_folder, 'public'

def serve (file)
    send_file File.join(settings.public_folder, file)
end

get '/' do
    serve "index.html"
end

get '/usage' do 
    serve "usage.html"
end

get '/tab-solution' do 
    serve "tab-solution.html"
end
