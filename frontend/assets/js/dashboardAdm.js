const name = localStorage.getItem('name');
const id = localStorage.getItem('id');
let modalCtrl = false;
let modalCtrl2 = false;
let idUpdate = null;
let typeUpdate = null;

$().ready(() => {
    $('#modal-product').hide();
    $('#modal-user').hide();

    Swal.fire(
        `Olá ${name}`,
        'Seja bem vindo!',
        'success'
    );

    getProvider();
    getProduct();
    createOptionState(getStatesBr());

    $("#product-list").select2();
    $('#amount').mask('9');
    $("#phone").mask("(99) 99999-9999");
    $("#cep").mask("99999999");
    $('#price').mask("###0,00", { reverse: true })
});

async function getProvider() {
    $('#provider-approved-list').html('');
    $('#provider-wait-list').html('');

    try {
        let listProvider = JSON.parse(
            await $.get(`../backend/providerController.php?action=selectAll`)
        );

        let htmlAproved = '';
        let htmlWait = '';
        if (listProvider.length > 0) {
            listProvider.forEach(el => {
                let tmp = `
                    <div class="left-content box-card">
                        <div class="header-btn-action">
                            <span onclick="handleDelete('provider', ${el.id});">Deletar</span>
                            ${el.approved > 0 ? `<span onclick="handleEdit('provider', ${el.id});">Editar</span>` : ''}
                        </div>

                        <div class="flex-row-w">
                            <span>${el.name}</span>&nbsp;&nbsp;
                            <span>${el.cnpj}</span>
                        </div>

                        <div  class="flex-row-w">
                            <span>${el.email}</span>&nbsp;&nbsp;    
                            <span>${el.phone}</span>
                        </div>
                                
                        <span>${el.address}, ${el.city}-${el.state}</span>
                `

                if (el.approved > 0) {
                    tmp += '</div>';
                    htmlAproved += tmp;
                }
                else {
                    tmp += `
                        <div id="btn-approve-request" class="left-content-footer">
                                <button onclick="handleApprove('provider', ${el.id});">Aprovar</button>
                            </div>
                        </div>
                    `;
                    htmlWait += tmp;
                }
            });

            $('#provider-approved-list').append(htmlAproved);
            $('#provider-wait-list').append(htmlWait);
        }
    } catch (error) {
        console.log(error);
        errorInform();
    }
}

async function getProduct() {
    $('#product-approved-list').html('');
    $('#product-wait-list').html('');

    try {
        const query = JSON.parse(
            await $.get(`../backend/productController.php?action=selectAll`)
        );

        let htmlAproved = '';
        let htmlWait = '';
        if (query.length > 0) {
            query.forEach(el => {
                let tmp = `
                    <div class="left-content box-card">
                        <div class="header-btn-action">
                            <span onclick="handleDelete('product', ${el.id});">Deletar</span>
                            ${el.approved > 0 ? `<span onclick="handleEdit('product', ${el.id});">Editar</span>` : ''}
                        </div>

                        <div class="flex-row-w">
                            <span>${el.name}</span>&nbsp;&nbsp;
                        </div>

                        <div  class="flex-row-w">
                            <span>${el.stock}</span>&nbsp;&nbsp;    
                            <span>R$${el.price}</span>
                        </div>
                                
                        <span>${el.provname}</span>
                `

                if (el.approved > 0) {
                    tmp += '</div>';
                    htmlAproved += tmp;
                }
                else {
                    tmp += `
                        <div id="btn-approve-request" class="left-content-footer">
                                <button onclick="handleApprove('product', ${el.id});">Aprovar</button>
                            </div>
                        </div>
                    `;
                    htmlWait += tmp;
                }
            });

            $('#product-approved-list').append(htmlAproved);
            $('#product-wait-list').append(htmlWait);
        }

    } catch (error) {
        console.log(error);
        errorInform();
    }
}

async function handleApprove(type, id) {
    console.log('aprovar', id);
    try {
        const query = await $.post(
            `../backend/${type}Controller.php?action=update&id=${id}`, { approved: 1 }
        );

        if(query !== 'false'){
            if(type === 'provider') getProvider();
            else getProduct();

            successInform();
        }
        else errorInform();

    } catch (error) {
        console.log(error);
        errorInform();
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    url = `../backend/${typeUpdate}Controller.php?action=update&id=${idUpdate}`;
    let data = {};
    try {
        if(typeUpdate === 'user' || typeUpdate === 'provider'){
            data = {
                name: $('#name').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                address: `${$('#cep').val()}, ${$('#street').val()}, ${$('#number').val()}, ${$('#complement').val()}, ${$('#district').val()}`,
                city: $('#city').val(),
                password: $('#password').val(),
                state: $("#state option:selected").text(),
            };

            if (typeUpdate === 'user') {
                data['cpf'] = $('#doc').val();
                data['risklevel'] = $(".check-level-risk input:checked").length;
                data['type'] = 'user';
            }
            else {
                data['cnpj'] = $('#doc').val();
                data['approved'] = $('#aproved').is(":checked") ? 1 : 0;
                data['type'] = 'comercial';
            }
        }
        else {
            data = {
                name: $('#name-prod').val(),
                stock: $('#stock').val(),
                price: ($('#price').val()).replace(',', '.'),
                approved: $('#approved-prod').is(":checked") ? 1 : 0
            };
        }

        const query = await $.post(url, data);

        if (query !== 'false') {
            if(typeUpdate === 'user' || typeUpdate === 'provider') {
                getProvider();
                showModalUser();
            }
            else {
                getProduct();
                showModalProduct();
            }

            successInform();
            
            idUpdate = null;
            typeUpdate = null;
        }
        else {
            errorInform();
        }

    } catch (error) {
        console.log(error);
        errorInform();
    }
}

function handleDelete(type, id) {
    Swal.fire({
        title: 'Deletar',
        text: "Quer mesmo deletar esta informação?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69a7db',
        cancelButtonColor: '#D93644',
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
        reverseButtons: true
    }).then(async (result) => {
        if (result.value) {
            try {
                const query = await $.post(`../backend/${type}Controller.php?action=delete&id=${id}`);

                if (query !== 'false') {
                    successInform();

                    if(type === 'provider') getProvider();
                    else getProduct();

                }
                else errorInform();

            } catch (error) {
                console.log(error);
                errorInform();
            }
        }
    });
}

async function handleEdit(type, id) {
    if (type === 'user') {
        $('.check-level-risk').append(`
            <h2>Você se encaixa em um ou mais destes grupos?</h2>
            <input type="checkbox" id="hiper">
            <label for="hiper">Hipertenso</label>

            <input type="checkbox" id="asma">
            <label for="asma">Asmático</label>

            <input type="checkbox" id="diab">
            <label for="diab">Diabético</label>

            <input type="checkbox" id="fum">
            <label for="fum">Fumante</label>
        `);
    }
    else {
        $('.check-level-risk').html('');
        $('.check-level-risk').append(`
            <input type="checkbox" id="approved">
            <label for="approved">Aprovado</label>
        `);
        $('#title-edit').text('Editar Fornecedor');
        $('#doc').attr('placeholder', 'CNPJ *');
        $('#labelDoc').text('CNPJ');
        $("#doc").mask("99.999.999/9999-99");
    }

    try {
        const query = JSON.parse(await $.get(
            `../backend/${type}Controller.php?action=select&id=${id}`
            ));

        if (query !== 'false') {
            idUpdate = id;
            typeUpdate = type;

            if(type === 'user' || type === 'provider'){
                const address = (query.address).split(',');
                const [cep, street, number, complement, district] = address;
    
                $('#name').val(query.name);
                $('#email').val(query.email);
                $('#phone').val(query.phone);
                $('#cep').val(cep ? cep : '');
                $('#street').val(street ? street : '');
                $('#number').val(number ? (number).replace(' ', '') : '');
                $('#complement').val(complement ? complement : '');
                $('#district').val(district ? district : '');
                $('#city').val(query.city);
                $('#state').val(query.state);
    
                if (type === 'user') {
                    $('#doc').val(query.cpf);
                }
                else {
                    $('#doc').val(query.cnpj);
                    $('#approved').attr('checked', query.approved > 0);
                }

                showModalUser();
            }
            else {
                $('#name-prod').val(query.name);
                $('#stock').val(query.stock);
                $('#price').val(query.price);
                $('#approved-prod').attr('checked', query.approved > 0);

                showModalProduct();
            }

            
        }
        else errorInform();

    } catch (error) {
        console.log(error);
        errorInform();
    }
}

function createOptionState(states) {
    let html = '';

    states.forEach(el => {
        html += `<option value="${el.value}">${el.value}</option>`
    });

    $('#state').append(html);
}

function showModalUser() {
    modalCtrl = !modalCtrl;

    if (modalCtrl) {
        $('#modal-user').show();
    }
    else {
        $('#modal-user').hide();
    }
}

function showModalProduct() {
    modalCtrl2 = !modalCtrl2;

    if (modalCtrl2) {
        $('#modal-product').show();
    }
    else {
        $('#modal-product').hide();
    }
}

function logout() {
    Swal.fire({
        title: 'Sair',
        text: "Quer mesmo sair do sistema?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69a7db',
        cancelButtonColor: '#D93644',
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            localStorage.clear();
            window.location = './index.html';
        }
    });
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