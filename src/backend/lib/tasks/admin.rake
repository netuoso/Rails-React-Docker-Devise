namespace :admin do
  desc "Make first user an admin"
  task create_first_admin: :environment do
    user = User.first
    if user
      user.update!(admin: true)
      puts "Made #{user.email} an admin"
    else
      puts "No users found. Please create a user first."
    end
  end

  desc "Make a user admin by email"
  task :make_admin, [:email] => :environment do |_task, args|
    email = args[:email]
    if email.blank?
      puts "Please provide an email: rake admin:make_admin[user@example.com]"
      exit 1
    end

    user = User.find_by(email: email)
    if user
      user.update!(admin: true)
      puts "Made #{user.email} an admin"
    else
      puts "User with email #{email} not found"
    end
  end
end
