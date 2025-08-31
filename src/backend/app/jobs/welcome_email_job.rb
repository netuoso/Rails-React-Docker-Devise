class WelcomeEmailJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    # Here you would send a welcome email
    Rails.logger.info "Sending welcome email to #{user.email}"
    
    # Simulate some work
    sleep(2)
    
    Rails.logger.info "Welcome email sent to #{user.email}"
  rescue ActiveRecord::RecordNotFound
    Rails.logger.error "User with ID #{user_id} not found"
  end
end
