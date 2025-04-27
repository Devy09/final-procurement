export type PPMPTableColumn = {
    id: string;
    ppmp_item: string;
    unit_cost: number;
    quantity: number;
    ppmp_category: string;
    userId: string;
    user: {
        name: string | null;
        section: string | null;
    };
};