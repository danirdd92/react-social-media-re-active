using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence;
public class Seed
{
    public static async Task SeedData(DataContext context,
        UserManager<AppUser> userManager)
    {
        if (!userManager.Users.Any() && !context.Activities.Any())
        {
            var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Bruce Wayne",
                        UserName = "theRealBatman",
                        Bio = "I love to larp as a bat and fight crime, also very rich and single ;)",
                        Email = "bruce@re.active.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Joker",
                        UserName = "daJoke",
                        Bio = "Notorious standup comedian, influencer, love\\hate relationship with bats",
                        Email = "Joker@re.active.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Selina Kyle",
                        UserName = "PawPawMewMew",
                        Bio = "Cat person, alergic to dogs",
                        Email = "catwoman@re.active.com"
                    },
                };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }

            var activities = new List<Activity>
                {
                    new Activity
                    {
                        Title = "Chillout Session",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Join me for a few hours of vibing to some good ol' Dark knight OST mix",
                        Category = "music",
                        City = "Gotham City",
                        Venue = "The Bat Cave",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Live VLOG w/ Joker",
                        Date = DateTime.Now.AddMonths(-1),
                        Description = "Live from Arkham, visiting my old friend",
                        Category = "culture",
                        City = "Gotham City",
                        Venue = "Arkham Asylum",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new ActivityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Nightout",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Tired of saying inside? Come get wasted with us :)",
                        Category = "drinks",
                        City = "Gotham City",
                        Venue = "The IceBerg Lounge",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            },
                            new ActivityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 2",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Activity 2 months in future",
                        Category = "food",
                        City = "London",
                        Venue = "Jamies Italian",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new ActivityAttendee
                            {
                                AppUser = users[2],
                                IsHost = false
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 3",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Activity 3 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[1],
                                IsHost = true
                            },
                            new ActivityAttendee
                            {
                                AppUser = users[0],
                                IsHost = false
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 4",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Activity 4 months in future",
                        Category = "culture",
                        City = "London",
                        Venue = "British Museum",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[1],
                                IsHost = true
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 5",
                        Date = DateTime.Now.AddMonths(5),
                        Description = "Activity 5 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Punch and Judy",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new ActivityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 6",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Activity 6 months in future",
                        Category = "music",
                        City = "London",
                        Venue = "O2 Arena",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            },
                            new ActivityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 7",
                        Date = DateTime.Now.AddMonths(7),
                        Description = "Activity 7 months in future",
                        Category = "travel",
                        City = "Berlin",
                        Venue = "All",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[0],
                                IsHost = true
                            },
                            new ActivityAttendee
                            {
                                AppUser = users[2],
                                IsHost = false
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Future Activity 8",
                        Date = DateTime.Now.AddMonths(8),
                        Description = "Activity 8 months in future",
                        Category = "drinks",
                        City = "London",
                        Venue = "Pub",
                        Attendees = new List<ActivityAttendee>
                        {
                            new ActivityAttendee
                            {
                                AppUser = users[2],
                                IsHost = true
                            },
                            new ActivityAttendee
                            {
                                AppUser = users[1],
                                IsHost = false
                            },
                        }
                    }
                };

            await context.Activities.AddRangeAsync(activities);
            await context.SaveChangesAsync();
        }
    }
}