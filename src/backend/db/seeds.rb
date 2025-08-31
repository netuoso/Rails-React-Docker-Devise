# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create an admin user
admin_email = 'admin@example.com'
admin_password = 'password123'

admin_user = User.find_or_create_by(email: admin_email) do |user|
  user.password = admin_password
  user.password_confirmation = admin_password
  user.admin = true
end

if admin_user.persisted?
  puts "Admin user created: #{admin_email}"
  puts "Password: #{admin_password}"
  puts "Admin status: #{admin_user.admin?}"
else
  puts "Failed to create admin user: #{admin_user.errors.full_messages.join(', ')}"
end
