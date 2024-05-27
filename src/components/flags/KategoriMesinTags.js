import { Tag } from 'antd';
import { useStore } from '@/states';

export default function KategoriMesinTags(props) {
	const { value } = props;
	const { kategori: getKategori } = useStore();
	const { kategori } = getKategori;

	const tagList = kategori?.reduce((acc, curr) => ({ ...acc, [curr.id]: <Tag>{curr.categoryName}</Tag> }), {});
	return tagList && value ? tagList[value] : '-';
}
