$(document).ready(function() {
	display(envision.questions)
})

// combined functions for displaying questions
function display(questions) {
	// reset score since otherwise it would continue to add on page load
	envision.totalScore = 0;
	// envision total posible points
	envision.maxScore = maxScore(envision.questions)
	// throw the questions into the DOM
	displayQuestions(questions)
	// change selected and corresponding scores based on current session for value added
	updateSelect('va', 'valueAdded')
	// change selected based on current session for applicability
	updateSelect('ap', 'applicable')
}

// appends each question to the tbody tag
function displayQuestions(questions) {
	var template = _.template($('#question').text())

	_.each(questions, function(question) {
		$('tbody').append(template({question: question}))
		// console.log($('.category').last())
		$('.category').last().children('.applicability').children('select').change(applicable(question))
		$('.category').last().children('.value-added').children('select').change(updateValues)
	})

	$('.question-separator').last().remove()
}

// onchange function for applicability select
function applicable(question) {

	return function() {

		var select = this;
		var val = $(select).val();
		var addedValue = $(select).parent().parent().children('.value-added').children('select')
		var score = $(select).parent().parent().children('.category-score')
		var maxPoints = $(select).parent().parent().children('.possible-points')
		var maxScore = $('#max-score')

		envision.DOM.applicable[$('.ap').index(this)] = $(this).prop('selectedIndex')

		if (val === 'unapplicable') {
			addedValue.children('.no-value').attr('selected', true)
			updateValues.call(addedValue)
			addedValue.attr('disabled', 'disabled');
			
			maxScore.text(envision.maxScore -= question.maxPoints)
			score.text('- -')
			maxPoints.text('- -')

		} else {
			addedValue.attr('disabled', false);
			maxScore.text(envision.maxScore += question.maxPoints)
			score.text(0)
			maxPoints.text(question.maxPoints)
		}
		setSession()
	}

}

// onchange function for value added select
function updateValues() {
	var select = this;
	var val = $(select).val()
	var score = $(select).parent().parent().children('.category-score')
	var index = $(this).prop('selectedIndex')

	envision.totalScore += parseInt(val) - parseInt(score.text())
	$('#actual-score').text(envision.totalScore)

	score.text(val)
	envision.DOM.valueAdded[$('.va').index(this)] = $(this).prop('selectedIndex')
	setSession()
}

// relate vals for default Conservative
function relate(question, val) {
	var conservativeVal = _.findWhere(question.addedValue, {level: 'Conserving'}).val

	if (val === conservativeVal) {
		return val;
	}
	if (val < conservativeVal) {
		return '-' + (conservativeVal - val).toString();
	}
	return '+' + (question.maxPoints - conservativeVal).toString();
}

// set changes to envision
function setSession() {
	console.log('setting session')
	sessionStorage.setItem('envision', JSON.stringify(envision));
}

// update selects with selected option selected
function updateSelect(klass, propName) {
	$('.' + klass).each(function(index) {
		var selectedIndex = envision.DOM[propName][index]
		// 0 to avoid unecessary processing
		if (selectedIndex > 0) {
			$(this).prop('selectedIndex', selectedIndex).change()
		}
	})
} 


// count words
// var words = $('#yo').val().split(' ');
//     alert(words.length);



