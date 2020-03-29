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
    }
}

function handleTypeUser(tp) {
    type = tp;
    showDivLogin();
}

async function handleLogin(event) {
    event.preventDefault();
    
    try {
        let query = await $.post('../backend/sessionController.php', {
            user: $('#user').val(),
            password: $('#password').val(),
            type
        });

        if (query !== 'false') {
            query = JSON.parse(query);
            alert(`Bem vindo ${query.name}`);

            const { name, id } = query;
            localStorage.setItem('name', name);
            localStorage.setItem('id', id);
            localStorage.setItem('type', query.type);
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