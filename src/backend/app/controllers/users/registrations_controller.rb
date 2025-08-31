# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  before_action :configure_account_update_params, only: [:update]
  before_action :authenticate_user!, only: [:update, :destroy]

  # POST /resource
  def create
    super
  end

  # PUT /resource
  def update
    super
  end

  # DELETE /resource
  def destroy
    # Verify current password before deletion
    current_password = params[:user]&.[](:current_password)
    
    unless current_password.present?
      render json: {
        errors: ['Current password is required to delete account']
      }, status: :unprocessable_entity
      return
    end

    unless resource.valid_password?(current_password)
      render json: {
        errors: ['Current password is incorrect']
      }, status: :unprocessable_entity
      return
    end

    resource.destroy
    yield resource if block_given?
    if resource.destroyed?
      render json: {
        message: 'Account deleted successfully.'
      }, status: :ok
    else
      render json: {
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:current_password, :password, :password_confirmation])
  end

  def configure_account_deletion_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:current_password])
  end

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        message: 'Account updated successfully.',
        user: { email: resource.email }
      }, status: :ok
    else
      render json: {
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
end
