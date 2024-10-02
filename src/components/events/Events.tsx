import Event from "./Event";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface CalendarEvent {
  summary: string;
  start: {
    dateTime?: string;
  };
  location?: string;
}

const Events = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.accessToken) return;
      try {
        // Step 1: Fetch all calendars
        const calendarListResponse = await axios.get(
          "https://www.googleapis.com/calendar/v3/users/me/calendarList",
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          },
        );

        const calendars = calendarListResponse.data.items;
        console.log("Calendars:", calendars);

        const allEvents: CalendarEvent[] = [];
        for (const calendar of calendars) {
          console.log(
            `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events`,
          );
          if (
            calendar.id != "addressbook#contacts@group.v.calendar.google.com" &&
            calendar.id != "en.usa#holiday@group.v.calendar.google.com"
          ) {
            const eventsResponse = await axios.get(
              `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events`,
              {
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                },
                params: {
                  maxResults: 3, // Optional: limit per calendar if you want
                  orderBy: "startTime",
                  singleEvents: true,
                  timeMin: new Date().toISOString(), // Use current date for upcoming events
                },
              },
            );
            const calendarEvents = eventsResponse.data.items || [];
            allEvents.push(...calendarEvents);
          }
        }

        // Step 3: Sort events by start time
        const sortedEvents = allEvents.sort((a, b) => {
          const dateA = new Date(a.start?.dateTime || "").getTime();
          const dateB = new Date(b.start?.dateTime || "").getTime();
          return dateA - dateB;
        });

        // Step 4: Take the most recent 3 events
        const upcomingEvents = sortedEvents.slice(0, 3);

        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching Google Calendar events", error);
      }
    };

    fetchEvents();
    const intervalId = setInterval(fetchEvents, 60000); // Refresh every 60 seconds
    return () => clearInterval(intervalId);
  }, [session?.accessToken]);

  return (
    <div className="flex flex-col items-center">
      <p className="pt-4 text-[1.8vw]">Upcoming</p>
      <p className="text-[1.8vw] leading-none">Events</p>
      <div className="flex flex-col gap-4 pt-[2.5vh]">
        {events.map((event, index) => (
          <Event
            key={index}
            name={event.summary || "No title provided"}
            dateTime={event.start?.dateTime || "TBD"}
            location={event.location || "No location provided"}
          />
        ))}
      </div>
    </div>
  );
};

export default Events;
