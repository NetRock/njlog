function LogViewModel(){
	var self = this;
	self.appLogDict = new Array;
	self.curAppLogs = ko.observableArray();
	self.curAppId = 0;
	self.lastRow = null;
	self.lastLog = null;
}

var logViewModel = new LogViewModel();

function Log(title, category, message, loggedDate){
	var self = this;
	self.title = title;
	self.category = category;
	self.message = message;
	self.loggedDate = loggedDate;

	self.setMessage = function(data, evt){
		if(logViewModel.lastLog != null){
			$(logViewModel.lastLog).removeClass('sel');
		}

		var src = evt.target.parentNode;
		$(src).addClass("sel");
		logViewModel.lastLog = src;
		$('#logMsgPane').text(self.message);
	}

	self.needCss = function(index){
		return index() % 2 == 0;
	}
}

$(document).ready(function () {
	$(".appRow").click(function(evt){
		if(logViewModel.lastRow != null){
			$(logViewModel.lastRow).removeClass("sel");
		}

		var appId = this.id;
		$(this).addClass("sel");
		logViewModel.lastRow = this;

		logViewModel.curAppLogs.removeAll();

		var url = "/log/" + this.id;
		var category = $("#category").val();
		if(category != "All"){
			url += "/" + category;
		}

		if(logViewModel.appLogDict[appId] == null){
			queryLog(url, appId);
		}
		else{
			fillViewModel(logViewModel.appLogDict[appId]);
		}
	});

	$("#category").change(function(){
		logViewModel.appLogDict = [];
	});

	function queryLog(url, appId){
		$('#loadingImg').show();
		$.ajax({
			type: "GET",
			cache: false,
			url: url,
			success: function(result, status){
				logViewModel.appLogDict[appId] = result;
				fillViewModel(result);
				$('#loadingImg').hide();
			}
		}).fail(function(err){
			$('#loadingImg').hide();
			alert(err.responseText);
		});
	}

	function fillViewModel(result){
		for(var i = 0; i < result.length; i++){
			logViewModel.curAppLogs.push(new Log(result[i].title, 
				result[i].category, result[i].message, result[i].loggedDate));
		}		
	}

	ko.applyBindings(logViewModel);
});