Feature: User Availability for an event

  Only for one user and one event, so ignore multi user and multi event at the moment

  Scenario: User set availabilty
    When the user set their available time slot in a week
    Then the user availability should updated

  Scenario: User get availability
    Given the user has set their available time slot in a week
    When the user request their availability in a month
    Then the user should be able to see their available time slot, at what date at what time