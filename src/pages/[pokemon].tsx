import Image from "next/image";
import { PokemonList } from "./index";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";

const typeMapper = {
	normal: "bg-gray-300",
	fighting: "bg-red-600",
	flying: "bg-blue-300",
	poison: "bg-purple-600",
	ground: "bg-yellow-600",
	rock: "bg-yellow-800",
	bug: "bg-green-600",
	ghost: "bg-purple-800",
	steel: "bg-gray-500",
	fire: "bg-red-800",
	water: "bg-blue-800",
	grass: "bg-green-800",
	electric: "bg-yellow-300",
	psychic: "bg-pink-600",
	ice: "bg-blue-200",
	dragon: "bg-purple-900",
	dark: "bg-gray-900",
	fairy: "bg-pink-300",
	unknown: "bg-gray-400",
	shadow: "bg-gray-700",
};

export default function PokemonDetailsPage({
	pokemonData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const router = useRouter();

	return (
		<main className="w-full min-h-screen justify-center flex flex-col items-center p-2 md:p-0">
			<div className="bg-white border-2 rounded-lg border-gray-400 shadow w-full max-w-lg p-8 relative">
				<button className="w-8 h-8 absolute top-4 left-4 hover:bg-gray-200 transition-colors p-1 rounded" onClick={() => router.back()}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-full h-full"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 19.5L8.25 12l7.5-7.5"
						/>
					</svg>
				</button>

				<div className="flex flex-col md:flex-row justify-around items-center mb-2">
					<div className="flex items-center">
						{pokemonData.sprites.front_default && (
							<Image
								alt={`${pokemonData.name}'s Image`}
								src={pokemonData.sprites.front_default}
								className="w-32"
								width={512}
								height={512}
							/>
						)}
						<div className="text-3xl capitalize flex flex-col gap-2">
							{pokemonData.name}
							<span className="text-gray-500">
								ID: {pokemonData.id}
							</span>
						</div>
					</div>
					<div className="capitalize gap-2 text-sm flex md:text-base md:block">
						<p>Weight : {pokemonData.weight} cm</p>
						<p>Height : {pokemonData.height} kg</p>
						<p>
							Types:
							{pokemonData.types.map((type, i) => (
								<span
									key={i}
									className={`text-white text-sm p-1 mx-1 capitalize rounded-lg ${
										typeMapper[type.type.name]
									}`}
								>
									{type.type.name}
								</span>
							))}{" "}
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-6">
					<hr className="border-gray-400" />
					<div className="text-xl capitalize flex flex-col gap-2">
						Abilities
						<p className="flex gap-2 text-base">
							{pokemonData.abilities.map((ability, i) => (
								<span key={i}>{ability.ability.name}</span>
							))}
						</p>
					</div>
					<hr className="border-gray-400" />
					<div className="text-xl capitalize flex flex-col gap-2">
						Forms
						<p className="flex gap-2 text-base">
							{pokemonData.forms.map((form, i) => (
								<span key={i}>{form.name}</span>
							))}
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}

type PokemonDetailsPageProps = {
	pokemonData: {
		name: string;
		id: number;
		sprites: {
			front_default: string;
		};
		weight: number;
		height: number;
		types: {
			type: {
				name: keyof typeof typeMapper;
				url: string;
			};
		}[];
		abilities: {
			ability: {
				name: string;
				url: string;
			};
		}[];
		forms: {
			name: string;
			url: string;
		}[];
	};
};
export const getStaticProps: GetStaticProps<PokemonDetailsPageProps> = async (
	ctx
) => {
	const pokemonName = ctx.params?.pokemon as string;
	console.log(pokemonName);
	const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
	const data = (await res.json()) as PokemonDetailsPageProps["pokemonData"];
	return { props: { pokemonData: data } };
};

export const getStaticPaths: GetStaticPaths = async () => {
	const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=2000");
	const data = (await res.json()) as PokemonList;

	return {
		paths: data.results.map(({ name }) => ({
			params: { pokemon: name },
		})),
		fallback: true,
	};
};
