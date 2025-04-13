
import React from 'react'

function Footer() {
    return (
        <footer className="py-4 bg-white border-t">
            <div className="container flex flex-col md:flex-row items-center justify-center md:px-6">
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} · All rights reserved · Quizly
                </p>
            </div>
        </footer>
    )
}

export default Footer
