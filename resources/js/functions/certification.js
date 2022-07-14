import { _alert, _confirm } from '../functions/message';
import { isValidEmail } from "../functions/validate";
import { getFromStorage, setInStorage } from "../functions/storage";

function isValidPhone (phone) {
  
  phone = phone.replace(/\D/g, '');

  if (!(phone.length >= 10 && phone.length <= 11)) return false;

  if (phone.length == 11 && parseInt(phone.substring(2, 3)) != 9) return false;

  for (var n = 0; n < 10; n++) {
      if (phone == new Array(11).join(n) || phone == new Array(12).join(n)) return false;
  }
  
  var DDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
      21, 22, 24, 27, 28, 31, 32, 33, 34,
      35, 37, 38, 41, 42, 43, 44, 45, 46,
      47, 48, 49, 51, 53, 54, 55, 61, 62,
      64, 63, 65, 66, 67, 68, 69, 71, 73,
      74, 75, 77, 79, 81, 82, 83, 84, 85,
      86, 87, 88, 89, 91, 92, 93, 94, 95,
      96, 97, 98, 99];
      
  if (DDD.indexOf(parseInt(phone.substring(0, 2))) == -1) return false;

  if (phone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(phone.substring(2, 3))) == -1) return false;

  return true;
}

function loadingTable() {

  let session = getFromStorage('dbClient');

    if(session) {
      
      var infos = JSON.parse(session);

      $("#showMessage").fadeOut();
      $(".table").find("thead").remove();
      $(".table").find("tr").remove();
      $(".table").find("th").remove();
      $(".table").find("td").remove();

      var tabela = "<thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Assunto</th><th>Ação</th></tr></thead><tbody>";

      infos.forEach(function(val, key){

        tabela += "<tr><td>"+val.name+"</td><td>"+val.email+"</td><td>"+val.tel+"</td><td>"+val.ass+"</td><td><button class='ui button' id='editData' data-id='"+key+"'>Editar</button><button class='ui red button' id='removeData' data-id='"+key+"'>Remover</button></td></tr>";

      });

      tabela += "</tbody>";

      $(".table").append(tabela);
      
    }
}

$(function(){

  loadingTable();

    $('.ui.form.formContact')
  .form({
    on: 'blur',
    fields: {
        nome: {
        identifier: 'nome',
        rules: [
          {
            type   : 'empty',
            prompt : 'Informe um nome!'
          }
        ]
      },
      email: {
        identifier: 'email',
        rules: [
          {
            type   : 'email',
            prompt : 'Informe um e-mail válido!'
          }
        ]
      },
      tel: {
        identifier: 'tel',
        rules: [
          {
            type   : 'empty',
            prompt : 'Informe um telefone!'
          },
          {
            type   : 'minLength[14]',
            prompt : 'Informe um telefone correto!'
          }

        ]
      },
      assunto: {
        identifier: 'assunto',
        rules: [
          {
            type   : 'empty',
            prompt : 'Informe um assunto!'
          }
        ]
      },
      mensagem: {
        identifier: 'mensagem',
        rules: [
          {
            type   : 'empty',
            prompt : 'Informe uma mensagem!'
          },
          {
            type   : 'maxLength[100]',
            prompt : 'Insira no máximo 100 caracteres!'
          }
        ]
      }
    },
    onSuccess: function (event) {     

        event.preventDefault();

        return false;
    }
  });

  $("#input_name").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".inputName").text(item.val());
    } else {
      $(".inputName").text("");
    }
  });

  $("#input_email").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".inputEmail").text(item.val());
    } else {
      $(".inputEmail").text("");
    }
  });

  $("#input_tel").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".inputTel").text(item.val());
    } else {
      $(".inputTel").text("");
    }
  });

  $("#input_assunto").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".inputAssunto").text(item.val());
    } else {
      $(".inputAssunto").text("");
    }
  });

  $("#input_mensagem").on('keyup', function(){
    var item = $(this);
    if(item.val()) {
      $(".inputMensagem").text(item.val());
    } else {
      $(".inputMensagem").text("");
    }
  });

  $(".formContact").submit(function(e){
    e.preventDefault();

      var form = $(this);
      var formData = form.serializeArray();
        
      var name = $('#input_name').val();
      var email = $('#input_email').val();
      var tel = $('#input_tel').val();
      var ass = $('#input_assunto').val();
      var me = $('#input_mensagem').val();

      if(!isValidEmail(email)) {

        swal({
          text: 'Informe um E-mail válido!',
          type: 'info',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        });

        return false;
      }

      if(!isValidPhone(tel)) {

        swal({
          text: 'Informe um Telefone válido!',
          type: 'info',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        });

        return false;

      }

      var item = getFromStorage('dbClient');
      if(item) {

          var arrItem = JSON.parse(item);

          let userFormCertificaArr = {
            'name': name,
            'email': email,
            'tel': tel,
            'ass': ass,
            'me': me
          }

          var edit = $("#input_chave").val();
          if(edit) {

            arrItem[edit] = userFormCertificaArr;

          } else {
            arrItem.push(userFormCertificaArr);
          }

          setInStorage('dbClient', JSON.stringify(arrItem));

      } else {

        let userFormCertificaArr = [{
          'name': name,
          'email': email,
          'tel': tel,
          'ass': ass,
          'me': me
        }]

        setInStorage('dbClient', JSON.stringify(userFormCertificaArr));

      }

      form.find("input").val("");
      form.find("textarea").val("");
      $(".input_name").text("");
      $(".input_email").text("");
      $(".input_tel").text("");
      $(".input_assunto").text("");
      $(".input_mensagem").text("");

      swal({
        text: 'Sucesso!',
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      });

      loadingTable();

      return false;
  
  });

  $(".table").on("click", "#editData", function(){

    var key = $(this).data('id');

    let session = getFromStorage('dbClient');
    var infos = JSON.parse(session);

    $("#input_name").val(infos[key].name);
    $(".input_name").text(infos[key].name);
    $("#input_email").val(infos[key].email);
    $(".input_email").text(infos[key].email);
    $("#input_assunto").val(infos[key].ass);
    $(".input_assunto").text(infos[key].ass);
    $("#input_mensagem").val(infos[key].me);
    $(".input_mensagem").text(infos[key].me);
    $("#input_tel").val(infos[key].tel);
    $(".input_tel").text(infos[key].tel);
    $("#input_chave").val(key);

    document.querySelector('.menuheader').scrollIntoView({
      behavior: 'smooth'
    });


  });

  $(".table").on("click", "#removeData", function(){

    var key = $(this).data('id');

    let session = getFromStorage('dbClient');
    var infos = JSON.parse(session);

    swal({
      title: 'Tem certeza que deseja remover?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Eu Quero!',
      cancelButtonText: 'Não Quero!'
    }).then((result) => {

      if (result) {

        infos.splice(key, 1);
        setInStorage('dbClient', JSON.stringify(infos));

        swal({
          text: 'Removido com sucesso!',
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
  
        loadingTable();
      }
    })
  });
});


