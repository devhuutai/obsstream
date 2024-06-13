$(document).ready(function() {
    $('#createKey').click(function() {
      var isChecked = $('#flexSwitchCheckChecked').is(':checked') ? 1 : 0;
      var title = $('#title').val();
      $.ajax({
        url: '/erp/creat-key',
        type: 'POST',
        data: { isChecked: isChecked , title:title},
        success: function(response) {
            window.location.href = window.location.origin + '/erp/key/'+ response?.data?.streamKey 
        },
        error: function(xhr, status, error) {
          // Xử lý lỗi (nếu có)
        }
      });
    });

    $('#submitLogin').click(function() {
      var name = $('#name').val()
      var password = $('#password').val()
      var data = {
        name : name,
        password :password
      }
      $.ajax({
        url: '/auth',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(response) {
          if(response?.status == 200){
            window.location.href = '/erp'
          }
        },
        error: function(xhr, status, error) {
          // Xử lý lỗi (nếu có)
        }
      });
    });
    // $('.delete-btn').click(function() {
    //   var uuid = $(this).data('uuid');
      
    //   $.ajax({
    //     url: '/erp/stream-list/', // Thay thế đường dẫn API thích hợp
    //     type: 'POST',
    //     data: { uuid: uuid},
    //     success: function(response) {
    //       window.location.href = '/erp/'
    //     },
    //     error: function(xhr, status, error) {
    //       // Xử lý lỗi nếu cần thiết
    //     }
    //   });
    // });
  });