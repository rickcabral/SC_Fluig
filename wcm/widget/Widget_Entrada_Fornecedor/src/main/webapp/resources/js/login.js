var SocialLoginExample = SuperWidget.extend({

    message: null,
    instanceId: null,

	bindings: {
		local: {
			'wcm_user': ['focus_wcmUserFocus', 'blur_wcmUserBlur'],
			'wcm_pass': ['focus_wcmPassFocus', 'blur_wcmPassBlur'],
			'login-name-wrapper': ['mouseenter_containerActionsEnter', 'mouseleave_containerActionsLeave'],
			'login-image-wrapper': ['mouseenter_containerActionsEnter', 'mouseleave_containerActionsLeave'],
			'login-relation-list-itens': ['click_loginRelationListItens'],
			'login-config-list-itens': ['click_loginConfigListItens'],
			'login': ['click_login'],
			'logoff': ['click_logoff'],
			'selectLanguage': ['click_selectLanguage'],
            'choose-context': ['click_chooseIdentityContext'],
            'choose-company': ['click_chooseIdentityCompany'],
            'edit-image-profile': ['click_updateImageProfile']
		},
		global:{
            'select-context': ['click_selectIdentityContext'],
            'select-company': ['click_selectIdentityCompany']
        }
	},

	init: function() {
        
        this.showWidget();
	},
	
	showWidget: function() {
		
		var template = this.templates['master-widget-login-template'];
		var html = Mustache.render(template, {
			isUserLogged: WCMAPI.isUserLogged,
			isNormalUser: +WCMAPI.userType !== 2
		});
		
		this.DOM.append(html);
		
		this.createBindings();
	},
	
	createBindings: function() {
		
		var self = this;
		
		$(document).on('click', function(e) {
	        var $clicked = $(e.target);
	        if (!$clicked.parents().hasClass("container-image-wrapper")) {
	        	$('.menu-user-actions').hide();
			}
	        if (!$clicked.parents().hasClass("container-login-wrapper")){
	        	$('.wcm-login-config').hide();
			}
	    });

        this.message = new WCMC.message();

        try {
            this.rest(WCMSpaceAPI.TOTVSUserExperienceRest.ISTOTVSUSEREXPERIENCESACTIVE, [] , function(data) {
                if (data.isUserExperiencesActive) {
                    self.setCompany(self);
                }

            } );

        } catch (e) {}

        limitNameSizeIfTooLarge();

        function limitNameSizeIfTooLarge(name){
            var userNameElement = $("#logged-user-name");
            var userName = userNameElement.html().trim();
            var MAX_USERNAME_LENGTH = 40;

            if(userName.length > MAX_USERNAME_LENGTH){
                userNameElement.html(userName.substring(0, MAX_USERNAME_LENGTH) + "[...]");
            }
        }
	},
	
	updateImageProfile: function(el, ev) {
		WCMBC.cropImage({}, function(err, data) {
			if(err) {
				FLUIGC.toast({
					message: "${i18n.getTranslation('userpreferences.error.change.image')}",
					type: 'danger'
				});
				return false;
			}
			$(window).trigger('fluig.update.image.profile');
		});
	},

	wcmUserFocus: function(el, ev) {
		$(el).attr("value", "usuário");
		var text = "usuário";
		$(el).addClass("active");
		if($(el).attr("value") == text) $(el).attr("value", "");
	},

	wcmUserBlur: function(el ,ev) {
		$(el).attr("value", "usuário");
		var text = "usuário";
		$(el).removeClass("active");
		if($(el).attr("value") == "") $(el).attr("value", text);
	},

	wcmPassFocus: function(el, ev) {
		$(el).attr("value", "senha");
		var text = "senha";
		$(el).addClass("active");
		if($(el).attr("value") == text) $(el).attr("value", "");
	},

	wcmPassBlur: function(el, ev) {
		$(el).attr("value", "senha");
		var text = "senha";
		$(this).removeClass("active");
		if($(this).attr("value") == "") $(this).attr("value", text);
	},

	containerActionsEnter: function(el, ev) {
		ev.preventDefault();
		$(el).children('.container-box-actions').show();
	},

	containerActionsLeave: function(el, ev) {
		ev.preventDefault();
		$(el).children('.container-box-actions').hide();
	},

	loginRelationListItens: function(el, ev) {
		var socialAlias = $(el).data("social-alias"),
		socialType = $(el).data("social-type"),
		types = ["following", "followers", "communities"];

		if (socialType === types[0]){
			socialGlobal.showFollowings(socialAlias);
		}

		if (socialType === types[1]){
			socialGlobal.showFollowers(socialAlias);
		}

		if (socialType === types[2]){
			socialGlobal.showParticipations(socialAlias);
		}
	},

	loginConfigListItens: function(el, ev) {
		var alias = $(el).data('page-alias');

        switch(alias){
            case 'logoff':
                this.logoff();
                return false;
                break;
            case 'wcm-publish-page':
                return aliasPublishPage();
                return false;
                break;
            case 'wcm-view-history':
                this.openPageHistory();
                return false;
                break;
            case 'wcm-edit':
                return aliasEdit();
                break;
            case 'language':
                this.selectLanguage();
                return false;
                break;
            case 'wcm-discard-draft':
                this.discardDraft();
                return false;
                break;
            default:
                window.location.href = WCMAPI.protectedContextPath + '/' + WCMAPI.getTenantCode() + '/' + alias;
        }

        function publishPage() {
		    var inputID = 'save-dialog-version';
            var elementInputID = $("#" + inputID);
            var confirmDialog = WCMC.panel({
                data:"<div class='form'><label>${i18n.getTranslation('label.login.versionDescription')}:"
                   + "</label><input type='text' id='"+inputID+"' name='"+inputID+"' /></div>",
        	    title: "${i18n.getTranslation('label.login.inputYourVersionDescription')}",
                width: 400,
                height: 120,
                btmaximize: false,
                customButtons: ["${i18n.getTranslation('label.login.publish.page')}"]
            });
            confirmDialog.bind("panel-button-0", function() {
                var message = $("#"+inputID).val();
                if (message != null) {
                    message = message.replace(/[\\\/]/g, '|');
                    WCMSpaceAPI.PageService.PUBLISHPAGE(
                        {async: false},
                        WCMAPI.pageId,
                        message).content;
                    window.location.href = currentUrlWithoutEdit();
                }
            });
            elementInputID.focus();
        }

        function aliasPublishPage() {
            var isUnpublished = WCMSpaceAPI.PageService.ISPAGEUNPUBLISHED({async: false}, WCMAPI.pageId);
            if (isUnpublished) {
                var isLastEditUser = WCMSpaceAPI.PageService.ISLASTEDITUSEREQUALSCURRENTUSERFOREDIT({async: false}, WCMAPI.pageId);
                if (isLastEditUser) {
                    if (WCMSpaceAPI.PageService.CHANGELASTEDITUSER({async: false}, WCMAPI.pageId)) {
                        publishPage();
                    }
                } else {
                    WCM.editPage.concurrency();
                    WCM.editPage.concurrency.panel.bind("panel-button-0", function () {
                        if (WCMSpaceAPI.PageService.CHANGELASTEDITUSER({async: false}, WCMAPI.pageId)) {
                            WCM.editPage.concurrency.panel.close();
                            publishPage();
                        } else {
                            WCMC.messageError("${i18n.getTranslation('concurrency.error.changingUser')}");
                        }
                    });
                }
            } else {
                alert("${i18n.getTranslation('label.login.page.already.published')}");
                window.location.href = currentUrlWithoutEdit();
            }
            return false;
        }

        function aliasEdit() {
            var isLastEditUser = WCMSpaceAPI.PageService.ISLASTEDITUSEREQUALSCURRENTUSERFOREDIT({async: false}, WCMAPI.pageId);
            if (isLastEditUser) {
                WCMSpaceAPI.PageService.CREATEUNPUBLISHEDPAGE({async: false}, WCMAPI.pageId);
                window.location.href = currentUrlWithEdit();
            } else {
                WCM.editPage.concurrency();
                WCM.editPage.concurrency.panel.bind("panel-button-0", function () {
                    if (WCMSpaceAPI.PageService.CHANGELASTEDITUSER({async: false}, WCMAPI.pageId)) {
                        window.location.href = currentUrlWithEdit();
                    } else {
                        WCMC.messageError("${i18n.getTranslation('concurrency.error.changingUser')}");
                    }
                });
            }
            return false;
        }

	},

	login: function() {
		try {
			WCMAPI.login($('input[name=j_username]').val(), $('input[name=j_password]').val());
		} catch (err) {
			alert('${i18n.getTranslation("login.error")}');
		}
	},

	logoff: function() {
        if(WCMAPI.isSAMLEnabled){
            var alertModal = WCMC.panel({
                width: 380,
                height: 80,
                maximized:false,
                btmaximize: false,
                showbtclose: false,
                showCloseIcon: false,
                title: '${i18n.getTranslation("msg.logout.identity.alert.title")}',
                bodyContent: '${i18n.getTranslation("msg.logout.identity.alert.disclaimer")}',
                customButtons: ['${i18n.getTranslation("label.yes")}', '${i18n.getTranslation("label.no")}']
            });
            alertModal.bind('panel-button-0', function(){
                WCMAPI.logoff();
                alertModal.close();
            });
            alertModal.bind('panel-button-1', alertModal.close);
        }else{
            WCMAPI.logoff();
        }
	},

	selectLanguage: function(el, ev) {
        FLUIGC.modal({
            title: '${i18n.getTranslation("label.login.change.language")}',
            content: WCMAPI.convertFtl('wcmlanguage', 'view.ftl'),
            id: 'widget-change-language',
            size: 'small'
        });
	},

    loadIdentityContexts: function() {
        var data = WCMSpaceAPI.IdentityContextRest.CONTEXTS({async:false});
        return data;
    },

    loadIdentityCompanies: function() {
        var data = WCMSpaceAPI.IdentityContextRest.COMPANIES({async:false});
        return data;
    },

    setCompany: function(reference) {
        reference.rest(WCMSpaceAPI.IdentityContextRest.SETCOMPANY, [] , function(data) {
            $('#identity-app-company').show();
            $('#identity-clear').show();
            reference.setCompanyName();
        } );
    },

    setContextName: function() {
        var context = WCMSpaceAPI.IdentityContextRest.CONTEXT({async:false});
        $('#identityUserContext').text( context.displayName);
    },

    setCompanyName: function() {
        var company = WCMSpaceAPI.IdentityContextRest.COMPANY({async:false});
        if (company) {
            $('#identityAppCompany').text(company.displayName);
        }
    },

    chooseIdentityContext: function(el, ev) {
        var dados = { instanceId: this.instanceId,
            type: 'context',
            list: this.loadIdentityContexts()
        };
        var popup = Mustache.render( this.templates.tpl_select_identity_context, dados);
        this.openPopUp( popup, 'widget-select-identity-context', '${i18n.getTranslation("label.login.identity.context")}');
    },

    chooseIdentityCompany: function(el, ev) {
        var dados = { instanceId: this.instanceId,
            type: 'company',
            list: this.loadIdentityCompanies()
        };
        var popup = Mustache.render( this.templates.tpl_select_identity_context, dados);
        this.openPopUp( popup, 'widget-select-identity-company', '${i18n.getTranslation("label.login.identity.company")}');
    },

    selectIdentityContext: function(el, ev) {
        var id = $(el).data("id");
        var url = WCMSpaceAPI.IdentityContextRest.SWITCHCONTEXT({async:false}, id);
        if (url && url.launcherUrl) {
            this.message.showMessage('${i18n.getTranslation("msg.login.identity.switch.context.success")}');
            window.open( url.launcherUrl, '_blank');
        } else {
            this.message.showMessage('${i18n.getTranslation("msg.login.identity.switch.context.fail")}');
        }
    },

    selectIdentityCompany: function(el, ev) {
        var id = $(el).data("id");
        var resp =  WCMSpaceAPI.IdentityContextRest.SWITCHCOMPANY({async:false}, id);
        if (resp.success) {
            this.message.showMessage('${i18n.getTranslation("msg.login.identity.switch.company.success")}');
            window.location.reload();
        } else {
            this.message.showMessage('${i18n.getTranslation("msg.login.identity.switch.company.fail")}');
        }
    },

    openPopUp: function(popupHtml, cssClass, title) {

        if (popupHtml) {
            $("."+cssClass).remove();
            $("body").append(popupHtml);

            $("."+cssClass).dialog({
                title: title,
                width: 400,
                height: 300
            });

            setTimeout(function() {
                loadWidgets();
            }, 300);
        }

    },

	openPageHistory: function() {
        cfg = {
            url: "/wcm_page_history/view.ftl",
            width: 750,
            height: 550,
            maximized:false,
            title: "${i18n.getTranslation('page.history')}",
            customButtons: new Array("Restaurar")
        };

        panel = WCMC.panel(cfg);

        panel.bind("panel-button-0", function() {
            var record = pageHistory.table.selectedRows;
            if (WCMAPI.isUndefined(record)) {
                WCMC.messageWarn("${i18n.getTranslation('wcmpage.parent.selectPage')}");
                return;
            }
            WCMSpaceAPI.PageService.RESTOREVERSION({async:false},WCMAPI.pageId, record.version).content;
            panel.close();
            location.reload(true);
        });
    },

    discardDraft: function() {
        var confirmDiscard = WCMC.panel({
            data:"<div>${i18n.getTranslation('label.login.discard.draft.message')}</div>",
            title: "${i18n.getTranslation('label.login.discard.draft')}",
            width: 400,
            height: 100,
            btmaximize: false,
            showbtclose: false,
            showCloseIcon: false,
            customButtons: ["${i18n.getTranslation('label.yes')}","${i18n.getTranslation('label.no')}"]
        });
        confirmDiscard.bind("panel-button-0", function() {
            if (WCMSpaceAPI.PageService.DELETEUNPUBLISHEDVERSION({async:false},WCMAPI.pageId)) {
                var homePage = WCMAPI.protectedContextPath + '/' + WCMAPI.getTenantCode() + '/' + 'home';
                window.location.href = homePage;
            } else {
                WCMC.messageError("${i18n.getTranslation('label.login.discard.draft.error')}");
            }

            confirmDiscard.close();
        });
        confirmDiscard.bind("panel-button-1", function() {
            confirmDiscard.close();
        });
    }
});