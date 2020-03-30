$().ready(() => {
    createOptionState(getStatesBr());

    $('.radio-type-user input[type=radio]').change(function () {
        console.log(this.value);

        if (this.value == 'typeUser') {
            $('.check-level-risk').show();
            $('#doc').attr('placeholder', 'CPF');
            $('#labelDoc').text('CPF *');
            $("#doc").mask("999.999.999-99");
            $('#doc').val('');
        }
        else if (this.value == 'typeComercial') {
            $('.check-level-risk').hide();
            $('#doc').attr('placeholder', 'CNPJ *');
            $('#labelDoc').text('CNPJ');
            $("#doc").mask("99.999.999/9999-99");
            $('#doc').val('');
        }
    });

    $("#doc").mask("999.999.999-99");
    $("#phone").mask("(99) 99999-9999");
    $("#cep").mask("99999999");

});

function createOptionState(states) {
    let html = '';

    states.forEach(el => {
        html += `<option value="${el.value}">${el.value}</option>`
    });

    $('#state').append(html);
}

async function handleSubmit(event) {
    event.preventDefault();

    try {
        const data = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: `${$('#cep').val()}, ${$('#street').val()}, ${$('#number').val()}, ${$('#complement').val()}, ${$('#district').val()}`,
            city: $('#city').val(),
            password: $('#password').val(),
            type: $('#typeUser').is(":checked") ? 'user' : 'comercial',
            state: $("#state option:selected").text(),
        };

        let url = '';
        if ($('#typeUser').is(":checked")) {
            url = '../backend/userController.php?action=create';
            data['cpf'] = $('#doc').val();
            data['risklevel'] = $(".check-level-risk input:checked").length;
        }
        else {
            url = '../backend/providerController.php?action=create';
            data['cnpj'] = $('#doc').val();
        }

        const query = await $.post(url, data);

        if (query !== 'false') {
            const msg = $('#typeUser').is(":checked") ?
                'Seu cadastro foi efetuado com sucesso' :
                'Seu cadastro foi efetuado com sucesso e será avaliado e aprovado por um de nossos administradores. Aguarde por favor.';

            Swal.fire(
                'Parabéns!',
                msg,
                'success'
            ).then(() => {
                window.location = './index.html';
            });
        }
        else {
            errorInform();
        }

    } catch (error) {
        console.log(error);
        errorInform();
    }
}

async function checkDoc() {
    let url = `../backend/userController.php?action=selectByCpf&cpf=${$('#doc').val()}`;
    let typeDoc = 'CPF';

    if (!$('#typeUser').is(":checked")) {
        url = `../backend/providerController.php?action=selectByCnpj&cnpj=${$('#doc').val()}`;
        typeDoc = 'CNPJ';
    }

    try {
        const query = await $.get(url);

        const div = document.getElementById('doc');
        if (query !== 'false') {
            div.setCustomValidity(`${typeDoc} já cadastrado no sistema.`);
        }
        else div.setCustomValidity('');

    } catch (error) {
        console.log(error);
    }
}

async function checkEmail() {
    let url = `../backend/userController.php?action=selectByEmail&email=${$('#email').val()}`;

    if (!$('#typeUser').is(":checked")) {
        url = `../backend/providerController.php?action=selectByEmail&email=${$('#email').val()}`;
    }

    try {
        const query = await $.get(url);

        const div = document.getElementById('email');
        if (query !== 'false') {
            div.setCustomValidity(`E-mail já cadastrado no sistema!`);
        }
        else div.setCustomValidity('');

    } catch (error) {
        console.log(error);
    }
}

async function checkCep() {
    const query = await findByCep($('#cep').val());

    if (query) {
        $('#street').val(query.logradouro);
        $('#complement').val(query.complemento);
        $('#district').val(query.bairro);
        $('#city').val(query.localidade);
    }
}

function comparePassword() {
    const div = document.getElementById('passwordConfirm');
    if ($('#password').val() !== $('#passwordConfirm').val()) {
        div.setCustomValidity(`As senhas digitadas são diferentes!`);
    }
    else div.setCustomValidity('');
}