/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */

var ajax_running_timeout = null;

if (!id_language)
  var id_language = Number(1);

function str2url(str, encoding, ucfirst)
{
  str = str.toUpperCase();
  str = str.toLowerCase();
  if (PS_ALLOW_ACCENTED_CHARS_URL)
    str = str.replace(/[^a-z0-9\s\'\:\/\[\]-]\\u00A1-\\uFFFF/g,'');
  else
  {

    /* Lowercase */
    str = str.replace(/[\u00E0\u00E1\u00E2\u00E3\u00E5\u0101\u0103\u0105\u0430\u1EA7\u1EA3\u1EA1\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EA5\u1EA9\u1EAB\u1EAD]/g, 'a');
    str = str.replace(/[\u0431]/g, 'b');
    str = str.replace(/[\u00E7\u0107\u0109\u010D\u0446]/g, 'c');
    str = str.replace(/[\u010F\u0111\u0434]/g, 'd');
    str = str.replace(/[\u00E8\u00E9\u00EA\u00EB\u0113\u0115\u0117\u0119\u011B\u0435\u044D\u1EC7\u1EBB\u1EBD\u1EB9\u1EBF\u1EC1\u1EC3\u1EC5]/g, 'e');
    str = str.replace(/[\u0444]/g, 'f');
    str = str.replace(/[\u011F\u0121\u0123\u0433\u0491]/g, 'g');
    str = str.replace(/[\u0125\u0127]/g, 'h');
    str = str.replace(/[\u00EC\u00ED\u00EE\u00EF\u0129\u012B\u012D\u012F\u0131\u0438\u0456\u1EC9\u1ECB]/g, 'i');
    str = str.replace(/[\u0135\u0439]/g, 'j');
    str = str.replace(/[\u0137\u0138\u043A]/g, 'k');
    str = str.replace(/[\u013A\u013C\u013E\u0140\u0142\u043B]/g, 'l');
    str = str.replace(/[\u043C]/g, 'm');
    str = str.replace(/[\u00F1\u0144\u0146\u0148\u0149\u014B\u043D]/g, 'n');
    str = str.replace(/[\u00F2\u00F3\u00F4\u00F5\u00F8\u014D\u014F\u0151\u043E\u01A1]/g, 'o');
    str = str.replace(/[\u043F]/g, 'p');
    str = str.replace(/[\u0155\u0157\u0159\u0440]/g, 'r');
    str = str.replace(/[\u015B\u015D\u015F\u0161\u0441]/g, 's');
    str = str.replace(/[\u00DF]/g, 'ss');
    str = str.replace(/[\u0163\u0165\u0167\u0442]/g, 't');
    str = str.replace(/[\u00F9\u00FA\u00FB\u0169\u016B\u016D\u016F\u0171\u0173\u0443\u1EED]/g, 'u');
    str = str.replace(/[\u0432]/g, 'v');
    str = str.replace(/[\u0175]/g, 'w');
    str = str.replace(/[\u00FF\u0177\u00FD\u044B]/g, 'y');
    str = str.replace(/[\u017A\u017C\u017E\u0437]/g, 'z');
    str = str.replace(/[\u00E4\u00E6]/g, 'ae');
    str = str.replace(/[\u0447]/g, 'ch');
    str = str.replace(/[\u0445]/g, 'kh');
    str = str.replace(/[\u0153\u00F6]/g, 'oe');
    str = str.replace(/[\u00FC]/g, 'ue');
    str = str.replace(/[\u0448]/g, 'sh');
    str = str.replace(/[\u0449]/g, 'ssh');
    str = str.replace(/[\u044F]/g, 'ya');
    str = str.replace(/[\u0454]/g, 'ye');
    str = str.replace(/[\u0457]/g, 'yi');
    str = str.replace(/[\u0451]/g, 'yo');
    str = str.replace(/[\u044E]/g, 'yu');
    str = str.replace(/[\u0436]/g, 'zh');

    /* Uppercase */
    str = str.replace(/[\u0100\u0102\u0104\u00C0\u00C1\u00C2\u00C3\u00C4\u00C5\u0410\u1EA2\u1EA0\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC]/g, 'A');
    str = str.replace(/[\u0411]/g, 'B');
    str = str.replace(/[\u00C7\u0106\u0108\u010A\u010C\u0426]/g, 'C');
    str = str.replace(/[\u010E\u0110\u0414]/g, 'D');
    str = str.replace(/[\u00C8\u00C9\u00CA\u00CB\u0112\u0114\u0116\u0118\u011A\u0415\u042D\u1EBA\u1EBC\u1EB8\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6]/g, 'E');
    str = str.replace(/[\u0424]/g, 'F');
    str = str.replace(/[\u011C\u011E\u0120\u0122\u0413\u0490]/g, 'G');
    str = str.replace(/[\u0124\u0126]/g, 'H');
    str = str.replace(/[\u0128\u012A\u012C\u012E\u0130\u0418\u0406\u00CD\u00CC\u1EC8\u1ECA]/g, 'I');
    str = str.replace(/[\u0134\u0419]/g, 'J');
    str = str.replace(/[\u0136\u041A]/g, 'K');
    str = str.replace(/[\u0139\u013B\u013D\u0141\u041B]/g, 'L');
    str = str.replace(/[\u041C]/g, 'M');
    str = str.replace(/[\u00D1\u0143\u0145\u0147\u014A\u041D]/g, 'N');
    str = str.replace(/[\u00D3\u014C\u014E\u0150\u041E]/g, 'O');
    str = str.replace(/[\u041F]/g, 'P');
    str = str.replace(/[\u0154\u0156\u0158\u0420]/g, 'R');
    str = str.replace(/[\u015A\u015C\u015E\u0160\u0421]/g, 'S');
    str = str.replace(/[\u0162\u0164\u0166\u0422]/g, 'T');
    str = str.replace(/[\u00D9\u00DA\u00DB\u0168\u016A\u016C\u016E\u0170\u0172\u0423]/g, 'U');
    str = str.replace(/[\u0412]/g, 'V');
    str = str.replace(/[\u0174]/g, 'W');
    str = str.replace(/[\u0176\u042B]/g, 'Y');
    str = str.replace(/[\u0179\u017B\u017D\u0417]/g, 'Z');
    str = str.replace(/[\u00C4\u00C6]/g, 'AE');
    str = str.replace(/[\u0427]/g, 'CH');
    str = str.replace(/[\u0425]/g, 'KH');
    str = str.replace(/[\u0152\u00D6]/g, 'OE');
    str = str.replace(/[\u00DC]/g, 'UE');
    str = str.replace(/[\u0428]/g, 'SH');
    str = str.replace(/[\u0429]/g, 'SHH');
    str = str.replace(/[\u042F]/g, 'YA');
    str = str.replace(/[\u0404]/g, 'YE');
    str = str.replace(/[\u0407]/g, 'YI');
    str = str.replace(/[\u0401]/g, 'YO');
    str = str.replace(/[\u042E]/g, 'YU');
    str = str.replace(/[\u0416]/g, 'ZH');

    str = str.toLowerCase();

    str = str.replace(/[^a-z0-9\s\'\:\/\[\]-]/g,'');
  }
  str = str.replace(/[\u0028\u0029\u0021\u003F\u002E\u0026\u005E\u007E\u002B\u002A\u002F\u003A\u003B\u003C\u003D\u003E]/g, '');
  str = str.replace(/[\s\'\:\/\[\]-]+/g, ' ');

  // Add special char not used for url rewrite
  str = str.replace(/[ ]/g, '-');
  str = str.replace(/[\/\\"'|,;%]*/g, '');

  if (ucfirst == 1) {
    var first_char = str.charAt(0);
    str = first_char.toUpperCase()+str.slice(1);
  }

  return str;
}

function copy2friendlyURL()
{
  if (typeof($('#link_rewrite_' + id_language).val()) == 'undefined')
    return;
  if (typeof(id_product) == 'undefined')
    id_product = false;

  if (ps_force_friendly_product || !$('#link_rewrite_' + id_language).val().length || !id_product)//check if user didn't type anything in rewrite field, to prevent overwriting
  {
    $('#link_rewrite_' + id_language).val(str2url($.trim($('#name_' + id_language).val().replace(/^[0-9]+\./, ''), 'UTF-8').replace('%', '')));
    if ($('#friendly-url'))
      $('#friendly-url').html($('#link_rewrite_' + id_language).val());
    // trigger onchange event to use anything binded there
    $('#link_rewrite_' + id_language).change();
  }
  return;
}

function copyMeta2friendlyURL()
{
  if (!$('input[name="id_cms"]').length)
    $('#link_rewrite_' + id_language).val(str2url($('#name_' + id_language).val().replace(/^[0-9]+\./, ''), 'UTF-8'));
}

function updateCurrentText()
{
  $('#current_product').html($('#name_' + id_language).val());
}

function updateFriendlyURLByName()
{
  $('#link_rewrite_' + id_language).val(str2url($('#name_' + id_language).val(), 'UTF-8'));
  $('#friendly-url_' + id_language).html($('#link_rewrite_' + id_language).val());
}

function updateFriendlyURL()
{
  var link = $('#link_rewrite_' + id_language);
  if (link[0])
  {
    $('#friendly-url_' + id_language).text(str2url($('#link_rewrite_' + id_language).val(), 'UTF-8'));
  }
}

function updateLinkRewrite()
{
  $('#name_' + id_language).val($.trim($('#name_' + id_language).val()));
  $('#link_rewrite_' + id_language).val($.trim($('#link_rewrite_' + id_language).val()));
  var link = $('#link_rewrite_' + id_language);
  if (link[0])
  {
    link.val(str2url(link.val(), 'UTF-8'));
    $('#friendly-url_' + id_language).text(link.val());
  }
}

function toggleLanguageFlags(elt)
{
  $(elt).parents('.displayed_flag').siblings('.language_flags').toggle();
}

// Kept for retrocompatibility only (out of AdminProducts & AdminCategories)
function changeLanguage(field, fieldsString, id_language_new, iso_code)
{
    $('div[id^='+field+'_]').hide();
  var fields = fieldsString.split('¤');
  for (var i = 0; i < fields.length; ++i)
  {
    $('div[id^='+fields[i]+'_]').hide();
    $('#'+fields[i]+'_'+id_language_new).show();
    $('#'+'language_current_'+fields[i]).attr('src', '../img/l/' + id_language_new + '.jpg');
  }
  $('#languages_' + field).hide();
  id_language = id_language_new;
}

// kept for retrocompatibility - you should use hideOtherLanguage(id) since 1.6
function changeFormLanguage(id_language_new, iso_code, employee_cookie)
{
  $('.translatable').each(function() {
    $(this).find('.lang_' + id_language_new)
      .show()
      .siblings('div:not(.displayed_flag):not(.clear)').hide();
    $(this).find('.language_current').attr('src', '../img/l/' + id_language_new + '.jpg');
  });

  // For multishop checkboxes
  $('.multishop_lang_'+id_language_new).show().siblings('div[class^=\'multishop_lang_\']').hide();
  id_language = id_language_new;
  changeEmployeeLanguage();
  updateCurrentText();
}

function checkAll(pForm)
{
  for (i = 0, n = pForm.elements.length; i < n; i++)
  {
    var objName = pForm.elements[i].name;
    var objType = pForm.elements[i].type;
    if (objType == 'checkbox' && objName != 'checkme')
    {
      box = eval(pForm.elements[i]);
      box.checked = !box.checked;
    }
  }
}

function checkDelBoxes(pForm, boxName, parent)
{
  for (i = 0; i < pForm.elements.length; i++)
    if (pForm.elements[i].name == boxName)
      pForm.elements[i].checked = parent;
}

function checkPaymentBoxes(name, module)
{
  setPaymentBoxes(name, module);
  current = $('input#checkedBox_'+ name +'_'+ module + '[type=hidden]');
  $('form#form_'+ name +' input[type=checkbox]').each(
    function()
    {
      if ($(this).attr('name') == module + '_' + name + '[]')
        $(this).attr("checked", ((current.val() == 'checked') ? true : false));
    }
  );
  current.val() == 'checked' ? current.val('unchecked') : current.val('checked');
}

function setPaymentBoxes(name, module)
{
  current = $('input#checkedBox_'+ name +'_'+ module + '[type=hidden]');
  total = 0;
  checked = 0;
  $('form#form_'+ name +' input[type=checkbox]').each(
    function()
    {
      if ($(this).attr('name') == module + '_' + name + '[]')
      {
        ($(this).attr("checked") ? checked++ : '');
        total++;
      }
    }
  );
  (checked == total) ? current.val('unchecked') : current.val('checked');
}

function getE(name)
{
  if (document.getElementById)
    var elem = document.getElementById(name);
  else if (document.all)
    var elem = document.all[name];
  else if (document.layers)
    var elem = document.layers[name];
  return elem;
}

function formSubmit(e, button)
{
  var key;

  key = window.event ? window.event.keyCode : e.which;
  if (key == 13)
  {
    getE(button).focus();
    getE(button).click();
    e.preventDefault();
  }
}
function noComma(elem)
{
  getE(elem).value = getE(elem).value.replace(new RegExp(',', 'g'), '.');
}

/* Code generator for Affiliation and vouchers */
function gencode(size)
{
  getE('code').value = '';
  /* There are no O/0 in the codes in order to avoid confusion */
  var chars = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
  var randomNumbers = crypto.getRandomValues(new Uint32Array(size));
  for (var i = 1; i <= size; ++i) {
    getE('code').value += chars.charAt(Math.floor(randomNumbers[i]/2**32 * chars.length));
  }
}

function orderDeleteProduct(txtConfirm, txtExplain)
{
  ret = true;
  $('table#cancelProducts input[type=checkbox]:checked').each(
    function()
    {
      totalCancel = parseInt($(this).parent().parent().find('td.cancelQuantity input[type=text]').val());
      totalQty = parseInt($(this).parent().find('input#totalQty[type=hidden]').val());
      totalQtyReturn = parseInt($(this).parent().find('input#totalQtyReturn[type=hidden]').val());
      productName = $(this).parent().find('input#productName[type=hidden]').val();
      totalAvailable = totalQty - totalQtyReturn;
      if (totalCancel > totalAvailable)
      {
        jAlert(txtConfirm + ' : \'' + ' ' + productName + '\' ! \n\n' + txtExplain + ' ('+ totalCancel + ' > ' + totalAvailable +')' + '\n ');
        ret = false;
      }
    }
  );
  return ret;
}

function selectCheckbox(obj)
{
  $(obj).parent().parent().find('td.cancelCheck input[type=checkbox]').attr("checked", true);
}

function toggleShippingCost()
{
  generateDiscount = $('#generateDiscount').attr("checked");
  generateCreditSlip = $('#generateCreditSlip').attr("checked");
  if (generateDiscount != 'checked' && generateCreditSlip != 'checked')
  {
    $('#spanShippingBack input[type=checkbox]').attr("checked", false);
    $('#spanShippingBack').css('display', 'none');
  }
  else
    $('#spanShippingBack').css('display', 'block');
}

function orderOverwriteMessage(sl, text)
{
  var $zone = $('#txt_msg');
  var sl_value = sl.options[sl.selectedIndex].value;

  if (sl_value != '0')
  {
    if ($zone.val().length > 0 && !confirm(text))
      return ;
    $zone.val(sl_value);
  }

  $zone.trigger('autosize.resize');
}

function setCancelQuantity(itself, id_order_detail, quantity)
{
  $('#cancelQuantity_' + id_order_detail).val($(itself).prop('checked') ? quantity : '');
}

function stockManagementActivationAuthorization()
{
  if (getE('PS_STOCK_MANAGEMENT_on').checked)
  {
    getE('PS_ORDER_OUT_OF_STOCK_on').disabled = false;
    getE('PS_ORDER_OUT_OF_STOCK_off').disabled = false;
    getE('PS_DISPLAY_QTIES_on').disabled = false;
    getE('PS_DISPLAY_QTIES_off').disabled = false;
  }
  else
  {
    getE('PS_DISPLAY_QTIES_off').checked = true;
    getE('PS_DISPLAY_QTIES_on').disabled = 'disabled';
    getE('PS_DISPLAY_QTIES_off').disabled = 'disabled';
    getE('PS_ORDER_OUT_OF_STOCK_on').checked = true;
    getE('PS_ORDER_OUT_OF_STOCK_on').disabled = 'disabled';
    getE('PS_ORDER_OUT_OF_STOCK_off').disabled = 'disabled';
  }
}

function hookCheckboxes(id, opt, champ)
{
  if (opt == 1 && champ.checked == false)
    $('#Ghook'+id).attr('checked', false);
  else if (opt == 0)
  {
    if (champ.checked)
      $('.hook'+id).attr('checked', "checked");
    else
      $('.hook'+id).attr('checked', false);
  }
}

function changeCMSActivationAuthorization()
{
  if (getE('PS_CONDITIONS_on').checked)
    getE('PS_CONDITIONS_CMS_ID').disabled = false;
  else
    getE('PS_CONDITIONS_CMS_ID').disabled = 'disabled';
}

function disableZipFormat()
{
  if ($('#need_zip_code_on').prop('checked') == false)
  {
    $('.zip_code_format').hide();
    $('#zip_code_format').val('');
  }
  else
    $('.zip_code_format').show();
}

function disableTAASC()
{
  if ($('#iso_code').val() == 'US')
    $('#TAASC').show();
  else
    $('#TAASC').hide();
}

function spreadFees(id_range)
{
  newVal = $('#fees_all_'+id_range).val().replace(/,/g, '.');
  $('.fees_'+id_range).val(newVal);
}

function clearAllFees(id_range)
{
  $('#fees_all_'+id_range).val('');
}

function toggleDraftWarning(show)
{
  if (show)
    $('.draft').hide();
  else
    $('.draft').show();
}

function showRedirectProductOptions(show)
{
  if (show)
    $('.redirect_product_options').fadeIn();
  else
    $('.redirect_product_options').fadeOut();

  redirectSelectChange();
}

function redirectSelectChange()
{
  redirectTypeValue = $('#redirect_type :selected').val();
  if (redirectTypeValue == '404' ||
      redirectTypeValue == '410' ||
      redirectTypeValue == 'default' ||
      redirectTypeValue == '200-displayed' ||
      redirectTypeValue == '404-displayed' ||
      redirectTypeValue == '410-displayed')
    showRedirectProductSelectOptions(false);
  else
    showRedirectProductSelectOptions(true);
}

function addRelatedProduct(id_product_to_add, product_name)
{
  if (!id_product_to_add || id_product == id_product_to_add)
    return;
  $('#related_product_name').html(product_name);
  $('input[name=id_type_redirected]').val(id_product_to_add);
  $('#related_product_autocomplete_input').parent().hide();
  $('#related_product_remove').show();
}

function removeRelatedProduct()
{
  $('#related_product_name').html(no_related_product);
  $('input[name=id_type_redirected]').val(0);
  $('#related_product_remove').hide();
  $('#related_product_autocomplete_input').parent().fadeIn();
}

function showRedirectProductSelectOptions(show)
{
  if (show)
    $('.redirect_product_options_product_choise').show();
  else
  {
    $('.redirect_product_options_product_choise').hide();
    removeRelatedProduct();
  }

}

function showOptions(show)
{
  if (show)
    $('tr#product_options').show();
  else
    $('tr#product_options').hide();
}

function submitAddProductAndPreview()
{
  $('#fakeSubmitAddProductAndPreview').attr('name','submitAddProductAndPreview');
  $('#product_form').submit();
}

function submitAddcmsAndPreview()
{
  $('#previewSubmitAddcmsAndPreview').attr('name','submitAddcmsAndPreview');
  $('#cms').submit();
}

function checkAllMultishopDefaultValue(item)
{
  $(item).parent().find('input[name^=\'multishopOverrideOption\']').each(function(k, v)
  {
    $(v).attr('checked', item.checked);
    var name = $(v).attr('name');
    checkMultishopDefaultValue(v, name.substr(24, name.length - 25));
  })
}

function checkMultishopDefaultValue(obj, key)
{
  if (!$(obj).prop('checked') || $('#'+key).hasClass('isInvisible'))
  {
    $('#conf_id_'+key+' input, #conf_id_'+key+' textarea, #conf_id_'+key+' select, #conf_id_'+key+' button').prop('disabled', true);
    $('#conf_id_'+key+' label.conf_title').addClass('isDisabled');
    $(obj).prop('disabled', false);
  }
  else
  {
    $('#conf_id_'+key+' input, #conf_id_'+key+' textarea, #conf_id_'+key+' select, #conf_id_'+key+' button').prop('disabled', false);
    $('#conf_id_'+key+' label.conf_title').removeClass('isDisabled');
  }
  $('#conf_id_'+key+' .preference_default_multishop input').prop('disabled', false);
}

function toggleAllMultishopDefaultValue($container, value)
{
  $container.find('input[name^=\'multishopOverrideOption\']').each(function(k, v)
  {
    $(v).attr('checked', value);
    var name = $(v).attr('name');
    toggleMultishopDefaultValue(v, name.substr(24, name.length - 25));
  })
}

function toggleMultishopDefaultValue(obj, key)
{
  if (!$(obj).prop('checked') || $('#'+key).hasClass('isInvisible'))
  {
    $('#conf_id_'+key+' input, #conf_id_'+key+' textarea, #conf_id_'+key+' select, #conf_id_'+key+' button').attr('disabled', true);
    $('#conf_id_'+key+' label.conf_title').addClass('isDisabled');
  }
  else
  {
    $('#conf_id_'+key+' input, #conf_id_'+key+' textarea, #conf_id_'+key+' select, #conf_id_'+key+' button').attr('disabled', false);
    $('#conf_id_'+key+' label.conf_title').removeClass('isDisabled');
  }
  $('#conf_id_'+key+' input[name^=\'multishopOverrideOption\']').attr('disabled', false);
}

function doAdminAjax(data, success_func, error_func)
{
  $.ajax(
  {
    url : 'index.php',
    data : data,
    type : 'POST',
    success : function(data){
      if (success_func)
        return success_func(data);

      data = $.parseJSON(data);
      if (data.confirmations.length != 0)
        showSuccessMessage(data.confirmations);
      else
        showErrorMessage(data.error);
    },
    error : function(data){
      if (error_func)
        return error_func(data);

      alert("[TECHNICAL ERROR]");
    }
  });
}

//display a success/error/notice message
function showSuccessMessage(msg) {
  $.growl.notice({ title: "", message:msg});
}

function showErrorMessage(msg) {
  $.growl.error({ title: "", message:msg});
}

function showNoticeMessage(msg) {
  $.growl.notice({ title: "", message:msg});
}

$(function()
{
  if (typeof helper_tabs != 'undefined' && typeof unique_field_id != 'undefined')
  {
    $.each(helper_tabs, function(index) {
      $('#'+unique_field_id+'fieldset_'+index+' .form-wrapper').prepend('<div class="tab-content panel" />');
      $('#'+unique_field_id+'fieldset_'+index+' .form-wrapper').prepend('<ul class="nav nav-tabs" />');
      $.each(helper_tabs[index], function(key, value) {
        // Move every form-group into the correct .tab-content > .tab-pane
        $('#'+unique_field_id+'fieldset_'+index+' .tab-content').append('<div id="'+key+'" class="tab-pane" />');
        var elemts = $('#'+unique_field_id+'fieldset_'+index).find("[data-tab-id='" + key + "']");
        $(elemts).appendTo('#'+key);
        // Add the item to the .nav-tabs
        if (elemts.length != 0)
          $('#'+unique_field_id+'fieldset_'+index+' .nav-tabs').append('<li><a href="#'+key+'" data-toggle="tab">'+value+'</a></li>');
      });
      // Activate the first tab
      $('#'+unique_field_id+'fieldset_'+index+' .tab-content div').first().addClass('active');
      $('#'+unique_field_id+'fieldset_'+index+' .nav-tabs li').first().addClass('active');
    });
  }

  if (typeof formToMove != 'undefined' && typeof formDestination != 'undefined' )
  {
    $('<hr style="margin 24px 0;" />').appendTo('#'+formDestination)
    $('#configuration_fieldset_'+formToMove+' .form-wrapper').appendTo('#'+formDestination);
  }

  $('select.chosen').each(function(k, item){
    $(item).chosen({disable_search_threshold: 10, search_contains: true, width: '100%', });
  });
  // Apply chosen() when modal is loaded
  $(document).on('shown.bs.modal', function (e) {
    $('select.chosen-modal').chosen();
  })

  $('.isInvisible input, .isInvisible select, .isInvisible textarea').attr('disabled', true);
  $('.isInvisible label.conf_title').addClass('isDisabled');

  // Disable options fields for each row with a multishop default checkbox
  $('.preference_default_multishop input[type=checkbox]').each(function(k, v)
  {
    var key = $(v).attr('name');
    var len = key.length;
    checkMultishopDefaultValue(v, key.substr(24, len - 25));
  });

  $('input[name^=\'multishopOverrideOption\']').each(function(k, v)
  {
    var key = $(v).attr('name');
    var len = key.length;
    toggleMultishopDefaultValue(v, key.substr(24, len - 25));
  });

  $(document).on('keyup change', '.copy2friendlyUrl', function(e){
    if (!isArrowKey(e))
      return copy2friendlyURL();
  });

  // on live will make this binded for dynamic content
  $(document).on('keyup change', '.updateCurrentText', function(e){
    if (typeof e == KeyboardEvent)
      if(isArrowKey(e))
        return;

    updateCurrentText();
  });

  $(document).on('keyup change', '.copyMeta2friendlyURL', function(e){
    if (!isArrowKey(e))
      return copyMeta2friendlyURL()
  });

  $(document)
    .ajaxStart(function() {
      ajax_running_timeout = setTimeout(function() {
        showAjaxOverlay()
      }, 1000);
    })
    .ajaxStop(function() {
      setTimeout(function() {
        $('#ajax_running').hide()
      }, 1000);
      clearTimeout(ajax_running_timeout);
    })
    .ajaxError(function() {
      setTimeout(function() {
        $('#ajax_running').hide()
      }, 1000);
      clearTimeout(ajax_running_timeout);
    });

  // Ensure the spinner is hidden if no AJAX requests are running when the page loads
  if ($.active === 0) {
    $('#ajax_running').hide();
  }

  //Check filters value on submit filter
  $("[name='submitFilter']").on('click', function(event) {
    var list_id = $(this).data('list-id');
    var empty_filters = true;

    $(document.body).find("input[name*='"+list_id+"Filter']").each(function() {
      if ($(this).val() != '')
      {
        empty_filters = false;
        return false;
      }
    });

    $(document.body).find("select[name*='"+list_id+"Filter']").each(function() {
      empty_filters = false;
      return false;
    });

    if (empty_filters)
    {
      event.preventDefault();
      $('#'+list_id+'-empty-filters-alert').show();
    }
  });

  // if count errors
  $('#hideError').on('click', function(e)
  {
    e.preventDefault();
    $('.error').hide('slow', function (){
      $('.error').remove();
    });
    return false;
  });

  // if count warnings
  $(document).on('click', '#linkSeeMore', function(e){
    e.preventDefault();
    $('#seeMore').show();
    $(this).hide();
    $('#linkHide').show();
    return false;
  });
  $(document).on('click', '#linkHide', function(e){
    e.preventDefault();
    $('#seeMore').hide();
    $(this).hide();
    $('#linkSeeMore').show();
    return false;
  });
  $(document).on('click', '#hideWarn', function(e){
    e.preventDefault();
    $('.warn').hide('slow', function (){
      $('.warn').remove();
    });
    return false;
  });

  $('.swap-container').each(function() {
    var swap_container = this;
    /** make sure that all the swap id is present in the dom to prevent mistake **/
    if (typeof $('.addSwap', this) !== undefined && typeof $(".removeSwap", this) !== undefined &&
      typeof $('.selectedSwap', this) !== undefined && typeof $('.availableSwap', this) !== undefined)
    {
      bindSwapButton('add', 'available', 'selected', this);
      bindSwapButton('remove', 'selected', 'available', this);

      $('button:submit').on('click', function() {
        bindSwapSave(swap_container);
      });
    }
  });

    if ($('.kpi-container').length) {
        refresh_kpis();
    }

    $('.kpi-refresh').on('click', '.refresh-kpis', function () {
        refresh_kpis(true);
    });
});

function bindSwapSave(context)
{
  if ($('.selectedSwap option', context).length !== 0)
    $('.selectedSwap option', context).attr('selected', 'selected');
  else
    $('.availableSwap option', context).attr('selected', 'selected');
}

function bindSwapButton(prefix_button, prefix_select_remove, prefix_select_add, context)
{
  $('.'+prefix_button+'Swap', context).on('click', function(e) {
    e.preventDefault();
    $('.' + prefix_select_remove + 'Swap option:selected', context).each(function() {
      $('.' + prefix_select_add + 'Swap', context).append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
      $(this).remove();
    });
    $('.selectedSwap option', context).prop('selected', true);
  });
}


// Delete all tags HTML
function stripHTML(oldString)
{
  var newString = '';
  var inTag = false;
  for(var i = 0; i < oldString.length; i++) {
    if(oldString.charAt(i) == '<') inTag = true;
    if(oldString.charAt(i) == '>') {
      if(oldString.charAt(i+1)!='<')
      {
        inTag = false;
        i++;
      }
    }
    if(!inTag) newString += oldString.charAt(i);
  }
  return newString;
}

/**
 * Display a loading bar while an ajax call is ongoing.
 *
 * To prevent the loading bar display for a specific ajax call, set the beforeSend event in your ajax declaration:
 *    beforeSend : function(data)
    {
      // don't display the loading notification bar
      clearTimeout(ajax_running_timeout);
    }
 */
function showAjaxOverlay()
{
  $('#ajax_running').show('fast');
  clearTimeout(ajax_running_timeout);
}

function display_action_details(row_id, controller, token, action, params)
{
  var id = action+'_'+row_id;
  var current_element = $('#details_'+id);
  if (!current_element.data('dataMaped')) {
    var ajax_params = {
      'id': row_id,
      'controller': controller,
      'token': token,
      'action': action,
      'ajax': true
    };

    $.each(params, function(k, v) {
      ajax_params[k] = v;
    });

    $.ajax({
      url: 'index.php',
      data: ajax_params,
      dataType: 'json',
      cache: false,
      context: current_element,
      async: false,
      success: function(data) {
        if (typeof(data.use_parent_structure) == 'undefined' || (data.use_parent_structure == true))
        {
          if (current_element.parent().parent().hasClass('alt_row'))
            var alt_row = true;
          else
            var alt_row = false;
          current_element.parent().parent().after($('<tr class="details_'+id+' small '+(alt_row ? 'alt_row' : '')+'"></tr>')
            .append($('<td style="border:none!important;" class="empty"></td>')
            .attr('colspan', current_element.parent().parent().find('td').length)));
          $.each(data.data, function(it, row)
          {
            var bg_color = ''; // Color
            if (row.color)
              bg_color = 'style="background:' + row.color +';"';

            var content = $('<tr class="action_details details_'+id+' '+(alt_row ? 'alt_row' : '')+'"></tr>');
            content.append($('<td class="empty"></td>'));
            var first = true;
            var count = 0; // Number of non-empty collum
            $.each(row, function(it)
            {
              if(typeof(data.fields_display[it]) != 'undefined')
                count++;
            });
            $.each(data.fields_display, function(it, line)
            {
              if (typeof(row[it]) == 'undefined')
              {
                if (first || count == 0)
                  content.append($('<td class="'+current_element.align+' empty"' + bg_color + '></td>'));
                else
                  content.append($('<td class="'+current_element.align+'"' + bg_color + '></td>'));
              }
              else
              {
                count--;
                if (first)
                {
                  first = false;
                  content.append($('<td class="'+current_element.align+' first"' + bg_color + '>'+row[it]+'</td>'));
                }
                else if (count == 0)
                  content.append($('<td class="'+current_element.align+' last"' + bg_color + '>'+row[it]+'</td>'));
                else
                  content.append($('<td class="'+current_element.align+' '+count+'"' + bg_color + '>'+row[it]+'</td>'));
              }
            });
            content.append($('<td class="empty"></td>'));
            current_element.parent().parent().after(content.show('slow'));
          });
        }
        else
        {
          if (current_element.parent().parent().hasClass('alt_row'))
            var content = $('<tr class="details_'+id+' alt_row"></tr>');
          else
            var content = $('<tr class="details_'+id+'"></tr>');
          content.append($('<td style="border:none!important;">'+data.data+'</td>').attr('colspan', current_element.parent().parent().find('td').length));
          current_element.parent().parent().after(content);
          current_element.parent().parent().parent().find('.details_'+id).hide();
        }
        current_element.data('dataMaped', true);
        current_element.data('opened', false);

        if (typeof(initTableDnD) != 'undefined')
          initTableDnD('.details_'+id+' table.tableDnD');
      }
    });
  }

  if (current_element.data('opened'))
  {
    current_element.find('i.icon-collapse-top').attr('class', 'icon-collapse');
    current_element.parent().parent().parent().find('.details_'+id).hide('fast');
    current_element.data('opened', false);
  }
  else
  {
    current_element.find('i.icon-collapse').attr('class', 'icon-collapse-top');
    current_element.parent().parent().parent().find('.details_'+id).show('fast');
    current_element.data('opened', true);
  }
}

function quickSelect(elt)
{
  var eltVal = $(elt).val();
  if (eltVal == "0")
    return false;
  else if (eltVal.substr(eltVal.length - 6) == '_blank')
    window.open(eltVal.substr(0, eltVal.length - 6), '_blank');
  else
    location.href = eltVal;
}

function changeEmployeeLanguage()
{
  if (typeof allowEmployeeFormLang !== 'undefined' && allowEmployeeFormLang)
    for (var key in languages) {
      if (id_language === languages[key]['id_lang']) {
        $.post(changeFormLanguageUrl, {
          language_iso_code: languages[key]['iso_code']
        });

        break;
      }
    }
}

function hideOtherLanguage(id)
{
  $('.translatable-field').hide();
  $('.lang-' + id).show();

  var id_old_language = id_language;
  id_language = id;

  if (id_old_language != id)
    changeEmployeeLanguage();

  updateCurrentText();
}

function sendBulkAction(form, action)
{
  String.prototype.splice = function(index, remove, string) {
    return (this.slice(0, index) + string + this.slice(index + Math.abs(remove)));
  };

  var form_action = $(form).attr('action');

  if (form_action.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ') == '')
    return false;

  if (form_action.indexOf('#') == -1)
    $(form).attr('action', form_action + '&' + action);
  else
    $(form).attr('action', form_action.splice(form_action.lastIndexOf('&'), 0, '&' + action));

  $(form).submit();
}

/**
 * Searches for current controller and current CRUD action. This data can be used to know from where an ajax call is done (source tracking for example).
 * Action is 'index' by default.
 * For instance, only used for back-office.
 * @param force_action optional string to override action part of the result.
 */
function getControllerActionMap(force_action) {
  query = window.location.search.substring(1);
  vars = query.split("&");
  controller = "Admin";
  action = "index";

  for (i = 0 ; i < vars.length; i++) {
    pair = vars[i].split("=");

    if (pair[0] == "token")
      continue;
    if (pair[0] == "controller")
      controller = pair[1];

    if (pair.length == 1) {
      if (pair[0].indexOf("add") != -1)
        action = "new";
      else if (pair[0].indexOf("view") != -1)
        action = "view";
      else if (pair[0].indexOf("edit") != -1 || pair[0].indexOf("modify") != -1 || pair[0].indexOf("update") != -1)
        action = "edit";
      else if (pair[0].indexOf("delete") != -1)
        action = "delete";
    }
  }

  if (force_action !== undefined)
    action = force_action;

  if (typeof help_class_name != 'undefined')
    controller = help_class_name;

  return new Array('back-office',controller, action);
}

function ajaxStates(id_state_selected)
{
  $.ajax({
    url: `${$('#contains_states').data('statesUrl')}&id_country=${$('#id_country').val()}`,
    cache: false,
    success: function(response)
    {
      var $stateIdSelect = $("#id_state");
      var $stateSelectorRow = $("#contains_states");

      if (!response.states || response.states.length === 0) {
        $stateSelectorRow.fadeOut();
        // append initial empty value which is selected (and hidden) when there are no states
        $stateIdSelect.append(`<option value="0">-</option>`);
        $('#id_state option[value=0]').attr("selected", "selected");
      } else {
        $stateIdSelect.empty();
        for (const [name, id] of Object.entries(response.states)) {
          $stateIdSelect.append(`<option value="${id}">${name}</option>`)
        }
        $stateSelectorRow.fadeIn();
        $('#id_state option[value=' + id_state_selected + ']').attr("selected", "selected");
      }
    }
  });
}

function dniRequired() {
  var countryId = $('#id_country').val();
  if (!countryId) {
    return;
  }

  $.ajax({
    url: 'index.php',
    dataType: 'json',
    cache: false,
    data: 'token=' + address_token + '&ajax=1&dni_required=1&controller=AdminAddresses&id_country=' + countryId,
    success: function(resp) {
      if (resp && resp.dni_required) {
        $("#dni_required").fadeIn();
      } else {
        $("#dni_required").fadeOut();
      }
    }
  });
}

function check_for_all_accesses(tabsize, tabnumber)
{
  var i = 0;
  var res = 0;
  var right = 0;
  var rights = new Array('view', 'add', 'edit', 'delete', 'all');

  while (i != parseInt(tabsize) + 1)
  {
    if ($('#view'+i).prop('checked') == false || $('#edit'+i).prop('checked') == false || $('#add'+i).prop('checked') == false || $('#delete'+i).prop('checked') == false)
      $('#all'+i).attr('checked', false);
    else
      $('#all'+i).attr('checked', "checked");
    i++;
  }
  right = 0;
  while (right != 5)
  {
    res = 0;
    i = 0;
    while (i != tabsize)
    {
      if ($('#'+rights[right]+i).prop('checked') == true)
        res++;
      i++;
    }
    if (res == tabnumber - 1)
      $('#'+rights[right]+'all').attr('checked', "checked");
    else
      $('#'+rights[right]+'all').attr('checked', false);
    right++;
  }
}

function perfect_access_js_gestion(src, action, id_tab, tabsize, tabnumber, table)
{
  if (id_tab == '-1' && action == 'all')
  {
    $(table+' .add').attr('checked', src.checked);
    $(table+' .edit').attr('checked', src.checked);
    $(table+' .delete').attr('checked', src.checked);
    $(table+' .view').attr('checked', src.checked);
    $(table+' .all').attr('checked', src.checked);
  }
  else if (action == 'all')
    $(table+' .'+id_tab).attr('checked', src.checked);
  else if (id_tab == '-1')
    $(table+' .'+action).attr('checked', src.checked);
  check_for_all_accesses(tabsize, tabnumber);
}

verifMailREGEX = /^([\w+-]+(?:\.[\w+-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,66}(?:\.[a-z]{2})?)$/;
function verifyMail(testMsg, testSubject)
{
  $("#mailResultCheck").removeClass("alert-danger").removeClass('alert-success').html('<img src="../img/admin/ajax-loader.gif" alt="" />');
  $("#mailResultCheck").slideDown("slow");

  //local verifications
  if (!($("#testEmail").val().length > 0))
  {
    $("#mailResultCheck").addClass("alert-danger").removeClass("alert-success").removeClass('userInfos').html(errorMail);
    return false;
  }
  else if (!verifMailREGEX.test( $("#testEmail").val() ))
  {
    $("#mailResultCheck").addClass("alert-danger").removeClass("alert-success").removeClass('userInfos').html(errorMail);
    return false;
  }
  else
  {
    //external verifications and sets
    $.ajax(
    {
       url: "index.php",
       cache: false,
       type : "POST",
       data:
      {
        "mailMethod"  : (($("input[name=PS_MAIL_METHOD]:checked").val() == 2) ? "smtp" : "native"),
        "smtpSrv"   : $("input[name=PS_MAIL_SERVER]").val(),
        "testEmail"   : $("#testEmail").val(),
        "smtpLogin"   : $("input[name=PS_MAIL_USER]").val(),
        "smtpPassword"  : $("input[name=PS_MAIL_PASSWD]").val(),
        "smtpPort"    : $("input[name=PS_MAIL_SMTP_PORT]").val(),
        "smtpEnc"   : $("select[name=PS_MAIL_SMTP_ENCRYPTION]").val(),
        "testMsg"   : textMsg,
        "testSubject" : textSubject,
        "token"     : token_mail,
        "ajax"      : 1,
        "controller"       : 'AdminEmails',
        "action"      : 'sendMailTest'
      },
       success: function(ret)
       {
        if (ret == "ok")
        {
          $("#mailResultCheck").addClass("alert-success").removeClass("alert-danger").removeClass('userInfos').html(textSendOk);
          mailIsOk = true;
        }
        else
        {
          mailIsOk = false;
          $("#mailResultCheck").addClass("alert-danger").removeClass("alert-success").removeClass('userInfos').html(textSendError + '<br />' + ret);
        }
       }
     }
     );
  }
}

function checkLangPack(token){
  if ($('#iso_code').val().length == 2)
  {
    $('#lang_pack_loading').show();
    $('#lang_pack_msg').hide();
    doAdminAjax(
      {
        controller:'AdminLanguages',
        action:'checkLangPack',
        token:token,
        ajax:1,
        iso_lang:($('#iso_code').val()).toLowerCase(),
        ps_version:$('#ps_version').val()
      },
      function(ret)
      {
        $('#lang_pack_loading').hide();
        ret = $.parseJSON(ret);
        if( ret.status == 'ok')
        {
          content = $.parseJSON(ret.content);
          message = langPackOk + ' <b>'+content['name'] + '</b>) :'
            +'<br />' + langPackVersion + ' ' + content['version']
            + ' <a href="https://www.prestashop.com/download/lang_packs/gzip/' + content['version'] + '/'
            + ($('#iso_code').val()).toLowerCase()+'.gzip" target="_blank" class="link">'+download+'</a><br />' + langPackInfo;
          $('#lang_pack_msg').html(message);
          $('#lang_pack_msg').show();
        }
        else
          showErrorMessage(ret.error);
      }
     );
   }
}

function redirect(new_page) { window.location = new_page; }

function isCleanHtml(content)
{
  var events = 'onmousedown|onmousemove|onmmouseup|onmouseover|onmouseout|onload|onunload|onfocus|onblur|onchange';
  events += '|onsubmit|ondblclick|onclick|onkeydown|onkeyup|onkeypress|onmouseenter|onmouseleave|onerror|onselect|onreset|onabort|ondragdrop|onresize|onactivate|onafterprint|onmoveend';
  events += '|onafterupdate|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditfocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onmove';
  events += '|onbounce|oncellchange|oncontextmenu|oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondeactivate|ondrag|ondragend|ondragenter|ondragexit|onmousewheel';
  events += '|ondragleave|ondragover|ondragstart|ondrop|onerrorupdate|onfilterchange|onfinish|onfocusin|onfocusout|onhashchange|onhelp|oninput|onlosecapture|onmessage|onmouseup|onmovestart';
  events += '|onoffline|ononline|onpaste|onpropertychange|onreadystatechange|onresizeend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onsearch|onselectionchange';
  events += '|onselectstart|onstart|onstop|onanimationcancel|onanimationend|onanimationiteration|onanimationstart';
  events += '|onpointerover|onpointerenter|onpointerdown|onpointermove|onpointerup|onpointerout|onpointerleave|onpointercancel|ongotpointercapture|onlostpointercapture';
  events += '|onpagehide|onpageshow|onautocomplete|onautocompleteerror|oncanplay|oncanplaythrough|onclose|oncuechange|ondurationchange|onemptied|onended|oninvalid|onloadeddata';
  events += '|onloadedmetadata|onloadstart|onpause|onplay|onplaying|onpopstate|onprogress|onratechange|onreset|onseeked|onseeking|onshow|onsort|onstalled|onstorage|onsuspend|ontimeupdate';
  events += '|ontoggle|onvolumechange|onwaiting';

  var script1 = /<[\s]*script/im;
  var script2 = new RegExp('('+events+')[\s]*=', 'im');
  var script3 = /.*script\:/im;
  var script4 = /<[\s]*(i?frame|embed|object)/im;
  var script5 = /<\s*\w+[^>]*\s(on\w+)=["'][^"']*["']/ims;
  var rloCharacter = "\xE2\x80\xAE";

  if (script1.test(content) || script2.test(content) || script3.test(content) || script4.test(content) || script5.test(content) || content.indexOf(rloCharacter) !== -1)
    return false;

  return true;
}

function parseDate(date){
  return $.datepicker.parseDate("yy-mm-dd", date);
}

function refresh_kpis()
{
  var force = (arguments.length == 1 && arguments[0] == true);
  $('.box-stats').each(function() {
    if ($(this).attr('id')) {
      var functionName = 'refresh_' + $(this).attr('id').replace(/-/g, '_');
      if (typeof window[functionName] === 'function') {
        if (force) {
          window[functionName](true); // force refresh, ignoring cache delay
        } else {
          window[functionName]();
        }
      }
    }
  });
}

function createSqlQueryName()
{
  var container = false;
  var current = false;
  if ($('.breadcrumb')) {
    container = $('.breadcrumb li').eq(0).text().replace(/\s+/g, ' ').trim();
    current = $('.breadcrumb li').eq(-1).text().replace(/\s+/g, ' ').trim();
  }
  var title = false;
  if ($('h2.title'))
    title = $('h2.title').first().text().replace(/\s+/g, ' ').trim();

  var name = false;
  if (container && current && container != current)
    name = container + ' > ' + current;
  else if (container)
    name = container;
  else if (current)
    name = current;

  if (title && title != current && title != container)
  {
    if (name)
      name = name + ' > ' + title;
    else
      name = title;
  }

  return name.trim();
}

function confirm_link(head_text, display_text, confirm_text, cancel_text, confirm_link, cancel_link)
{
  $.alerts.okButton = confirm_text;
  $.alerts.cancelButton = cancel_text;
  jConfirm(display_text, head_text, function(confirm){
    if (confirm === true)
      document.location = confirm_link;
    else
      document.location = cancel_link;
  });

}

function TogglePackage(detail)
{
    var pack = $('#pack_items_' + detail);
    pack.css('display', (pack.css('display') == 'block') ? "none" : "block");
}
function countDown($source, $target) {
  var max = $source.attr("data-maxchar");
  $target.html(max-$source.val().length);

  $source.on('keyup', function(){
    $target.html(max-$source.val().length);
  });
}
