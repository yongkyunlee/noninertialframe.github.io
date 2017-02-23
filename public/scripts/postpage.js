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
    // from nothing to delete
    if (!$('#authPasswordGroup_' + commentId).is(':visible')) {
        $('#authPasswordGroup_' + commentId +', #cancelChange_' + commentId
          + ', #deleteAuth_' + commentId +', #pwQ_' + commentId).toggle();
    }
    // from edit to delete
    if ($('#change_' + commentId).is(':visible')) {
        $('#change_' + commentId + ', #editAuth_' + commentId
          + ', #deleteAuth_' + commentId + ', #display_' + commentId
          + ', #pwQ_' + commentId).toggle();
    }
    $('#delete_' + commentId).css("color", "black");
    $('#edit_' + commentId).css("color", "#C0C0C0");
}

function editComment(commentId) {
    // from nothing to edit
    if (!$('#change_' + commentId).is(':visible')) {
        $('#change_' + commentId + ', #editAuth_' + commentId).toggle();
    }
    if (!$('#authPasswordGroup_' + commentId).is(':visible')) {
        $('#authPasswordGroup_' + commentId + ', #cancelChange_' + commentId).toggle();
    }
    // from delete to edit
    if ($('#deleteAuth_' + commentId).is(':visible')) {
        $('#deleteAuth_' + commentId + ', #pwQ_' + commentId).toggle();
    }
    if ($('#display_' + commentId).is(':visible')) {
        $('#display_' + commentId).toggle();
    }
    $('#edit_' + commentId).css("color", "black");
    $('#delete_' + commentId).css("color", "#C0C0C0");
}

function cancelAction(commentId) {
    $('#authPasswordGroup_' + commentId + ', #cancelChange_' + commentId).toggle();
    // when edit is on
    if ($('#change_' + commentId).is(':visible')) {
        $('#change_' + commentId +', #display_' + commentId
          + ', #editAuth_' + commentId).toggle();
    }
    // when delete is on
    if ($('#deleteAuth_' + commentId).is(':visible')) {
        $('#deleteAuth_' + commentId + ', #pwQ_' + commentId).toggle();
    }
    $('#edit_' + commentId + ',  #delete_' + commentId).css("color", "#C0C0C0");
}

function deleteAuth(commentId) {
    var commentNumSpan = document.getElementById('commentNum');
    $.ajax({
        url: "/posts/" + postId + "/comments/" + commentId,
        type: 'DELETE',
        dataType: 'json',
        data: {'_id': commentId, 'password': $('#passwordInput_' + commentId).val()},
        success: function(result) {
            if (result['success']) {
                $('#div_'+commentId).remove();
                var commentNum = result['commentNum'];
                commentNumSpan.removeChild(commentNumSpan.firstChild);
                commentNumSpan.appendChild(document.createTextNode(" ("+commentNum + ")"));

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
                var commentNum = result['commentNum'];
                var commentNumSpan = document.getElementById('commentNum');
                var commentDiv = "<div class=\'commentDiv\' id=\'div_" + commentId + "\'>"
                                + "<div class=\'container-fluid commentDisplay\'>"
                                + "<div class=\'commentInfo\'>"
                                + "<span class=\'commentNickname\'>" + nickname + "</span>"
                                + "<span class=\'commentTime\'>"+ result['time'] + "</span></div>"
                                + "<div class=\'commentRoutes\'><span class=\'commentTimeBelow\'>"+ result['time'] + "</span>"
                                + "<div class=\'commentEditRoute\'>"
                                + "<span class=\'editRoute\' id=\'edit_" + commentId + "\'"
                                + "onclick=\"editComment(\'" + commentId + "\')\">Edit</span></div>"
                                + "<div class=\'commentDeleteRoute\'>"
                                + "<span class=\'deleteRoute\' id=\'delete_" + commentId + "\'"
                                + "onclick=\"deleteComment(\'" + commentId + "\')\">Delete</span></div></div></div>"
                                + "<div class=\'commentContent\' id=\'display_" + commentId + "\'>" + content + "</div>"
                                + "<textarea class=\'form-control commentEditInput\' id=\'change_" + commentId
                                + "\' style=\'display:none;\'>" + content + "</textarea>"
                                + "<div class=\'commentAuth\'>"
                                + "<div class=\'passwordAuth\' id=\'authPasswordGroup_" + commentId + "\' style=\'display:none;\'>"
                                + "<label for=\'authPassword_" + commentId + "\'>Password</label>"
                                + "<span class=\'commentPasswordInput\'><input class=\'form-control authPasswordForm\'"
                                + "type=\'password\' id=\'passwordInput_" + commentId + "\'></span></div>"
                                + "<div class=\'authGroup\'>"
                                + "<div class=\'deleteAuth\' id=\'deleteAuth_" + commentId + "\' style=\'display:none;\'>"
                                + "<button class=\'deleteBtn\' type=\'submit\' onclick=\"deleteAuth(\'" + commentId + "\')\">CONFIRM</button></div>"
                                + "<div class=\'editAuth\' id=\'editAuth_" + commentId + "\'style=\'display:none;\'>"
                                + "<button class=\'editBtn\' type=\'submit\' onclick=\"editAuth(\'" + commentId + "\')\">POST</button></div>"
                                + "<div class=\'cancelAuth\'><button class=\'cancelBtn\' id=\'cancelChange_" + commentId + "\'"
                                + "onclick=\"cancelAction(\'" + commentId + "\')\" style=\'display:none;\'>CANCEL</button></div></div></div></div>";
                $('#commentList').prepend(commentDiv);
                commentNumSpan.removeChild(commentNumSpan.firstChild);
                commentNumSpan.appendChild(document.createTextNode(" ("+commentNum + ")"));
            },
            error: function(request, status, error) {
                console.log(request.responseText);
                console.log(status);
                console.log(error);
            }
        });
        e.preventDefault();
        $('#contentInput').val('');
        $('#nicknameInput').val('');
        $('#passwordInput').val('');
    });
});