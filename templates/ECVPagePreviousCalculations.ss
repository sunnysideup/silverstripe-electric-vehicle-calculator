<% if PreviousCalculations %>
	<ul>
	<% loop PreviousCalculations %>
	<li><a href="$Link(retrieve)">$Title</a></li>
	<% end_loop %>
	</ul>
<% end_if %>
