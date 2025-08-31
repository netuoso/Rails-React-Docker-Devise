class ApplicationController < ActionController::Base
	# Skip CSRF protection for JSON requests (API)
	protect_from_forgery with: :null_session, if: -> { request.format.json? }
end
