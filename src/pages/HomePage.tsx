import { Link } from "react-router-dom";
import volvoImg from "../assets/images/volvo.jpg";

export default function HomePage() {
    return (
        <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={volvoImg}
                    alt="Volvo Truck on the road"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center text-white">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg">
                        Drive Efficiency. <br />
                        <span className="text-primary">Deliver Excellence.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 text-shadow max-w-2xl mx-auto leading-relaxed">
                        The next generation of fleet management is here. Monitor, manage, and optimize your logistics with real-time insights and seamless control.
                    </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link
                        to="/register"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-6 text-lg inline-flex items-center justify-center rounded-md font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Start Free Trial
                    </Link>
                    <Link
                        to="/login"
                        className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white h-10 px-8 py-6 text-lg inline-flex items-center justify-center rounded-md font-medium transition-all shadow-lg text-shadow"
                    >
                        Access Dashboard
                    </Link>
                </div>
            </div>
        </section>
    );
}
