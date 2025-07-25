# display welcome page for logged-in users with links to view all movers, upadete profile, etc

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


/**
 * renders main dashboard page for user once logged in, and provides links to navigate to other pages in the web app
 *
 * @returns {JSX.Element} - the rendered dashboard component
 */

export default function Dashboard() 
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push('/login');
        }
    }, [router]);
    
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard!</h1>
        <p className="mt-2 text-lg text-gray-700">You are logged in.</p>

        <div className="mt-6">
        {/* link that takes user to page to view all registered movers*/}
            <Link href="/movers" legacyBehavior>
                <a className="inline-block py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                    View Movers
                </a>
            </Link>
    
        {/* link that takes user to page where they can update their profile info */}
            <Link href="/profile/update" legacyBehavior>
                <a className="inline-block ml-4 py-3 px-6 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors">
                    Update Profile
                </a>
            </Link>
    
            {/* only show this option if logged in user is a mover */}
            {user && user.is_service_provider && (
                <Link href="/profile/availability" legacyBehavior>
                    <a className="inline-block py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                        Manage My Availability
                    </a>
                </Link>
            )}
        </div>
      </div>
    );
  }
