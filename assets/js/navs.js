    $("#sectionsNav").load("./page_navs/nav-header.html", function (response, status, xhr) {
        $("#footer").load("./page_navs/nav-footer.html", function () {
            $('#feedbackm').appendTo("body");
            $('#gethelp').appendTo("body");

            $('#submit-contact').click(function (e) {
                e.preventDefault();
                $('#validation-message').hide();
                var valid = true,
                    firstError;
                // var formFields = ['#contact-name', '#contact-email', '#contact-message'];
                $('.contact-control').each(function (index, element) {
                    element = $(this);
                    thisval = element.val();
                    if (!thisval || thisval == '') {
                        valid = false;
                        element.closest('.bmd-form-group').addClass('has-danger');
                        if (!firstError) {
                            firstError = element
                        }
                    }

                });
                if (valid) {
                    $('#validation-message').hide();
                    $(this).prop('disabled', true)
                        .addClass('disabled');
                    submitForm();
                } else {
                    firstError.focus();
                    $('#validation-message').slideDown();
                }

            });
        });
    });

    function submitForm() {

        var contact_name = $("#contact-name").val(),
            contact_email = $("#contact-email").val(),
            contact_message = $("#contact-message").val();

        // console.log('NAME: ' + contact_name +
        //     '; EMAIL: ' + contact_email +
        //     '; MESSAGE: ' + contact_message )

        $().SPServices({
            operation: "UpdateListItems",
            async: false,
            batchCmd: "New",
            listName: "{FA597BD1-4E23-42C0-B664-AD0B313E3DF2}",
            valuepairs: [
                ["Name", contact_name],
                ["Email", contact_email],
                ["Message", contact_message],
            ],
            completefunc: function (xData, Status) {
                var errorCode = $(xData.responseXML).find('ErrorCode').text();

                if (errorCode !== '0x00000000') {
                    $('#error-message').slideDown()
                    $('#submit-contact').prop('disabled', false)
                        .removeClass('disabled');
                    console.log(errorCode);

                } else {
                    $('#submit-contact').hide()
                    $('#error-message').hide()
                    $('#contact-form').hide()
                    $('#success-message').slideDown()

                    newItemID = $(xData.responseXML).SPFilterNode("z:row").attr("ows_ID");
                    $('#feedbackm').modal('hide');
                    $('#submit-contact').prop('disabled', false)
                        .removeClass('disabled')
                }
            }
        });

    }