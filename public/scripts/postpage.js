var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(inputStr) {
    return String(inputStr).replace(/[&<>"'`=\/]/g, function(s){
        return entityMap[s];
    });
}

function deleteComment(commentId) {
    if (!$('#authPasswordGroup_' + commentId).is(':visible')) {
        $('#authPasswordGroup_' + commentId +', #cancelChange_' + commentId
          + ', #deleteAuth_' + commentId).toggle();
    }
    if ($('#change_' + commentId).is(':visible')) {
        $('#change_' + commentId + ', #editAuth_' + commentId
          + ', #deleteAuth_' + commentId + ', #display_' + commentId).toggle();
    }
    $('#delete_' + commentId).css("color", "black");
    $('#edit_' + commentId).css("color", "#C0C0C0");
}

function editComment(commentId) {
    if (!$('#change_' + commentId).is(':visible')) {
        $('#change_' + commentId + ', #editAuth_' + commentId).toggle();
    }
    if (!$('#authPasswordGroup_' + commentId).is(':visible')) {
        $('#authPasswordGroup_' + commentId + ', #cancelChange_' + commentId).toggle();
    }
    if ($('#deleteAuth_' + commentId).is(':visible')) {
        $('#deleteAuth_' + commentId).toggle();
    }
    if ($('#display_' + commentId).is(':visible')) {
        $('#display_' + commentId).toggle();
    }
    $('#edit_' + commentId).css("color", "black");
    $('#delete_' + commentId).css("color", "#C0C0C0");
}

function cancelAction(commentId) {
    $('#authPasswordGroup_' + commentId + ', #cancelChange_' + commentId).toggle();
    if ($('#change_' + commentId).is(':visible')) {
        $('#change_' + commentId +', #display_' + commentId
          + ', #editAuth_' + commentId).toggle();
    }
    if ($('#deleteAuth_' + commentId).is(':visible')) {
        $('#deleteAuth_' + commentId).toggle();
    }
    $('#edit_' + commentId + ',  #delete_' + commentId).css("color", "#C0C0C0");
}

function deleteAuth(commentId) {
    $.ajax({
        url: "/posts/" + postId + "/comments/" + commentId,
        type: 'DELETE',
        dataType: 'json',
        data: {'_id': commentId, 'password': $('#passwordInput_' + commentId).val()},
        success: function(result) {
            if (result['success']) {
                $('#div_'+commentId).remove();
            } else {
                alert('Wrong password');
            }
        },
        error: function(request, status, error) {
                console.log(request.responseText);
                console.log(status);
                console.log(error);
        }
    });
}

function editAuth(commentId) {
    $.ajax({
        url: "/posts/" + postId + "/comments/" + commentId,
        type: 'PUT',
        dataType: 'json',
        data: {'updatedContent': $('#change_' + commentId).val(),
               'password': $('#passwordInput_' + commentId).val(),
               '_id': commentId
        },
        success: function(result) {
            if (result['success']) {
                $('#display_' + commentId + ', #editAuth_' + commentId + ', #authPasswordGroup_' + commentId +
                  ', #cancelChange_' + commentId + ', #change_' + commentId).toggle();
                document.getElementById("display_" + commentId).textContent = result['newContent'];
            } else {
                alert("Wrong password");
            }
        },
        error: function(request, status, error) {
                console.log(request.responseText);
                console.log(status);
                console.log(error);
        }
    });
}

$(document).ready(function(){
    $('#commentSubmitBtn').click(function(e){
        $.ajax({
            url: "/posts/" + postId + "/comments/create",
            dataType: 'json',
            type: 'POST',
            data: {'nickname': $('#nicknameInput').val(),
                   'password': $('#passwordInput').val(),
                   'content': $('#contentInput').val()
                  },
            success: function(result) {
                var nickname = escapeHtml(result['nickname']);
                var content = escapeHtml(result['content']);
                var commentId = result['_id']; // string
                var commentDiv = "<div class=\'commentDiv\' id=\'div_" + commentId + "\'>"
                                + "<p class=\'commentInfo\'>"
                                + "<span class=\'commentNicknamer\'>" + nickname + "</span>\n"
                                + "<span class=\'commentTime\'>"+ result['time'] + "</span>\n"
                                + "<span class=\'editRoute\' id=\'edit_" + commentId + "\'>Edit</span>\n"
                                + "<span class=\'deleteRoute\' onclick=\"deleteComment(\'" + commentId + "\')\">Delete</span></p>"
                                + "<p class=\'commentContent\'>" + content + "</p>" + "</div>";
                $('#commentList').prepend(commentDiv);
            },
            error: function(request, status, error) {
                console.log(request.responseText);
                console.log(status);
                console.log(error);
            }
        });
        e.preventDefault();
    });
});
