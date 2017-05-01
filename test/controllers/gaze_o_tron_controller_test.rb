require 'test_helper'

class GazeOTronControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get gaze_o_tron_index_url
    assert_response :success
  end

end
