let type = '';

$().ready(() => {
    localStorage.clear();

    $('#errorLogin').hide();

    showDivLogin();
});

function showDivLogin() {
    if (type === '') {
        $('#typeUser').show();
        $('#login').hide();
    }
    else {
        $('#typeUser').hide();
        $('#login').show();

        $('#user').attr('placeholder', `${type === 'user' ? 'CPF' : 'CNPJ'} ou E-mail`);
        $('#labelUser').text(`${type === 'user' ? 'CPF' : 'CNPJ'} ou E-mail`);
    }
}

function handleTypeUser(tp) {
    type = tp;
    showDivLogin();
}

async function handleSubmit(event) {
    event.preventDefault();

    try {
        let query = await $.post('../backend/sessionController.php', {
            user: $('#user').val(),
            password: $('#password').val(),
            type
        });

        if (query !== 'false') {
            query = JSON.parse(query);

            const { name, id, approved } = query;

            if (approved > 0) {
                localStorage.setItem('name', name);
                localStorage.setItem('id', id);
                localStorage.setItem('type', query.type);

                switch (query.type) {
                    case 'user':
                        localStorage.setItem('lastRequestDate', query.lastRequestDate);
                        localStorage.setItem('lastRequestAmount', query.lastRequestAmount);
                        localStorage.setItem('nextRequest', query.nextRequest);

                        window.location = './dashboardUser.html';
                        break;

                    case 'adm':
                        window.location = './dashboardAdm.html';
                        break;

                    case 'comercial':
                        localStorage.setItem('maxprice', query.maxprice);
                        window.location = './dashboardComercial.html';
                        break;

                    default:
                        break;
                }
            }
            else {
                Swal.fire(
                    `Olá ${name}`,
                    'Infelizmente seu cadastro ainda não foi aprovado por um de nossos administradores. Por favor, aguarde.',
                    'info'
                );
            }

        }
        else {
            $('#errorLogin').show();
        }

    } catch (error) {
        console.log(error);
    };
};

function newUser() {
    console.log('novo');
    window.location = './newUser.html';
}